# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with ts-node-dev (hot reload)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled output

npm run migrate      # Run pending migrations (Umzug + ts-node)
npm run rollback:migrate  # Rollback last migration batch
npm run seed         # Run seeders
npm run db:reset     # Drop and recreate DB
npm run db:fresh     # db:reset + seed

npm run test               # Run all Jest tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
# Run a single test file:
npx jest src/__tests__/scheduleCache.test.ts
```

## Required environment variables

`DB_USER`, `DB_NAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `JWT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `CORS_ORIGIN`

Optional: `TIMEZONE` (default `America/Mexico_City`), `EMAIL_PROVIDER` (default `resend`), `DB_TIMEZONE` (default `00:00` UTC).

The app calls `process.exit(1)` at startup if any required var is missing.

## Architecture

### Stack

Node.js + TypeScript + Express 5 + Sequelize 6 (PostgreSQL). Migrations run via Umzug (not sequelize-cli). Email via Resend SDK. File storage via Cloudinary. Validation via Joi. Auth via JWT (no refresh token rotation in middleware — refresh token model exists but is unused there).

### Request lifecycle

```
Request
  → rateLimiter (global 100 req/15 min)
  → authenticateToken | authenticateIfPresent   (auth.middleware.ts)
  → authorizeRoles([roles], config?)             (auth.middleware.ts)
  → validateBody(JoiSchema)                      (validate.ts)
  → Controller → Service → Sequelize Model
```

### Associations

All Sequelize associations live in `src/database/associations.ts` and are registered by calling `setupAssociations()` once in `app.ts` at startup. **Do not define associations inside model files** — they were centralized here to avoid alias conflicts and double-registration.

### Authorization middleware (`authorizeRoles`)

Supports two ownership patterns:

- **Direct** (`ownerField`): fetches the resource by PK and compares `resource[ownerField]` to `user.userId`. Always use `String()` on both sides — DB returns a number, JWT payload is a string.
- **Transitive** (`through`): fetches the resource, then follows `relationField` to a related model and checks `relatedOwnerField` there (e.g. Schedule → Business.owner_id).

`admin` role always bypasses ownership checks. If no `config` is passed, only the role is checked (no resource ownership verified).

### Schedule module

Schedules are stored as **individual date rows** (`YYYY-MM-DD`) in the `schedules` table — not as recurring day-of-week patterns. `createSchedule` expands a date range + weekly hours pattern into individual records via `expandDatesToRecords`. This means schedule lookups always filter by the exact `date` column, never by a day name.

`getSchedulesByBusiness` generates available slots for a full month, crosses them with active reservations (`pending`/`confirmed`), and caches results for 5 minutes per `businessId:YYYY-MM` key.

### Schedule cache invalidation

`scheduleCache.invalidate(`${business_id}:`)` must be called after any operation that changes slot availability:
- Creating, updating, or deleting a schedule
- Creating a reservation
- Changing a reservation status (`updateStatus`)
- Rescheduling a reservation

The cache is in-memory — not distributed. Multiple server instances will have independent caches.

### Timezone handling

All dates are stored in UTC. The service layer converts between UTC and `America/Mexico_City` using `date-fns-tz`. Key utilities in `src/utils/dateUtils.ts`:
- `convertDateToUTC(dateString, tz)` — local → UTC using `fromZonedTime`
- `convertUTCDateToLocal(date, tz)` — UTC → local string
- When constructing datetime strings for `convertDateToUTC`, always include seconds: `"YYYY-MM-DDTHH:mm:00"`. Without seconds, `fromZonedTime` may return an invalid Date.
- `Joi.string().isoDate()` normalizes dates to full ISO timestamps (e.g. `"2026-06-23"` → `"2026-06-23T00:00:00.000Z"`). Use `Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)` when you need a plain date string that won't be transformed.

### Reservation module

`createReservation` runs under a `SERIALIZABLE` transaction to prevent double-booking. It validates products, calculates `end_time` from the sum of `estimated_delivery_time` across all products, checks the schedule for the specific date (not day-of-week), and checks for overlapping `pending`/`confirmed` reservations.

`updateStatus` validates business hours and checks for conflicting `confirmed` reservations when confirming. Both `updateStatus` and `rescheduleReservation` enforce ownership at the service level (not only at the middleware level).

Emails are sent non-blocking via `Promise.allSettled` — failures are logged to console but do not affect the HTTP response.

### Email module (`src/modules/notifications/`)

```
EmailService          → orchestrates dispatch
  EmailProviderFactory → creates ResendProvider (or future providers)
    IEmailProvider    → sendEmail(to, subject, htmlString)
  Templates (*.ts)    → functions returning { subject, bodyTemplate: string }
```

Templates are plain TypeScript functions returning raw HTML strings. The `dispatch` private method handles the wiring between template output and provider. Adding a new template requires: creating the template file, adding the method to `EmailService`, and calling `Promise.allSettled` at the call site.

### Proof of payment

`POST /api/reservations/:id/upload-proof` is public. It stores images via Cloudinary under `reservations/proofs/` and creates a `reservation_proofs` record (not updating `proof_of_payment` on `reservations`). The `public_id` from Cloudinary is stored for future deletion. The `proof_of_payment` string column on `reservations` is a legacy field for externally hosted URLs submitted at creation time.

### File upload pattern

Multer with `memoryStorage()` is configured directly in each route file (business, product, reservation). Files are passed to `StorageService.uploadImage(file, folder)` which delegates to `CloudinaryStorageProvider`. Adding upload to a new resource follows this same pattern.
