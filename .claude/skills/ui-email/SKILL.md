---
name: ui-email
description: >
  Úsame cuando el usuario pida crear, diseñar o mejorar cualquier componente, layout, template o elemento visual relacionada con correos electrónicos. Aplica cuando
  se mencione UI, UX, interfaz, diseño, componente, template, formulario,
  dashboard, vista o cualquier elemento visual. Stack: TypeScript, Tailwind CSS, react-email.
---

# UI/UX Design System Skill

Stack activo: **TypeScript · Tailwind CSS · react-email · resend**

---

## 1. Paleta de colores

Usa exclusivamente estos tokens CSS. Nunca valores hexadecimales hardcodeados.

```
Background principal  → bg-background
Background secundario → bg-muted
Superficie de tarjeta → bg-card
Texto principal       → text-foreground
Texto secundario      → text-muted-foreground
Acento primario       → bg-primary       text-primary-foreground
Acento secundario     → bg-secondary     text-secondary-foreground
Destructivo           → bg-destructive   text-destructive-foreground
Borde                 → border-border
Anillo de foco        → ring-ring
```

Para overlays y gradientes sutiles usa opacidad de Tailwind:

- `bg-primary/10` → fondo tenue de acento
- `bg-muted/50` → superficie semitransparente
- `border-border/60` → borde suave

---

## 2. Tipografía

```
Heading display   → text-3xl font-bold tracking-tight
Heading sección   → text-2xl font-semibold tracking-tight
Heading tarjeta   → text-lg font-semibold
Subtítulo         → text-sm font-medium text-muted-foreground
Cuerpo            → text-sm leading-relaxed
Label de campo    → text-xs font-medium text-muted-foreground uppercase tracking-wide
Código inline     → font-mono text-sm bg-muted px-1.5 py-0.5 rounded
```

Regla: nunca uses `font-bold` en texto de párrafo. Nunca `text-xs` para cuerpo de contenido.

---

## 3. Espaciado y layout

Sistema de 8pt. Usa múltiplos: `p-2 p-4 p-6 p-8 p-12 p-16`.

```
Padding de página        → px-4 py-6  md:px-8 md:py-10
Gap entre secciones      → space-y-8  md:space-y-12
Gap interno de tarjeta   → p-5  md:p-6
Gap entre elementos      → gap-3  md:gap-4
Ancho máximo de contenido → max-w-7xl mx-auto
Ancho máximo de formulario → max-w-md mx-auto
```

---

---

## 4. Componentes — patrones obligatorios

### Tarjeta base

```tsx
<Card className="border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-semibold">Título</CardTitle>
    <CardDescription className="text-muted-foreground">
      Descripción
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">{/* contenido */}</CardContent>
</Card>
```

### Botón primario

```tsx
<Button className="gap-2 font-medium">
  <IconNombre className="h-4 w-4" />
  Acción
</Button>
```

### Botón secundario / ghost

```tsx
<Button
  variant="outline"
  size="sm"
  className="gap-2 text-muted-foreground hover:text-foreground"
>
  <IconNombre className="h-4 w-4" />
  Acción secundaria
</Button>
```

### Input con label

```tsx
<div className="space-y-1.5">
  <Label
    htmlFor="campo"
    className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
  >
    Nombre del campo
  </Label>
  <Input
    id="campo"
    placeholder="Placeholder descriptivo"
    className="bg-background border-border/80 focus-visible:ring-ring"
  />
</div>
```

### Badge de estado

```tsx
// Positivo
<Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
  Activo
</Badge>

// Advertencia
<Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0">
  Pendiente
</Badge>

// Error
<Badge variant="destructive" className="border-0">
  Error
</Badge>
```

### Empty state

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
  <div className="rounded-full bg-muted p-4">
    <IconNombre className="h-8 w-8 text-muted-foreground" />
  </div>
  <div className="space-y-1">
    <p className="font-medium">No hay elementos</p>
    <p className="text-sm text-muted-foreground max-w-xs">
      Mensaje explicativo breve de qué puede hacer el usuario.
    </p>
  </div>
  <Button size="sm" className="mt-2">
    Crear primero
  </Button>
</div>
```

### Loading skeleton

```tsx
<div className="space-y-3 animate-pulse">
  <div className="h-5 w-1/3 rounded-md bg-muted" />
  <div className="h-4 w-2/3 rounded-md bg-muted" />
  <div className="h-4 w-1/2 rounded-md bg-muted" />
</div>
```

---

---

## 5. Accesibilidad — obligatorio

- Todos los `<button>` con solo ícono necesitan `aria-label`.
- Todos los inputs necesitan `<Label>` asociado por `htmlFor` / `id`.
- Usa `role="alert"` en mensajes de error dinámicos.
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
- Nunca uses `outline-none` sin reemplazarlo con `focus-visible:ring-2`.

---

## 6. Responsive

Mobile-first siempre. Breakpoints en este orden:

```
base (mobile) → sm:640px → md:768px → lg:1024px → xl:1280px
```

Grids comunes:

```
Lista de tarjetas    → grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
Dashboard 2 cols     → grid grid-cols-1 md:grid-cols-2 gap-6
Sidebar + contenido  → flex flex-col lg:flex-row gap-8
```

---

## 7. Animaciones

Usa solo las utilidades built-in de Tailwind. Nada de librerías externas a menos que ya estén en el proyecto.

```
Entrada suave        → transition-all duration-200 ease-out
Hover de tarjeta     → hover:shadow-md transition-shadow duration-200
Fade in              → animate-in fade-in duration-300
Slide desde abajo    → animate-in slide-in-from-bottom-4 duration-300
Spin de loading      → animate-spin
Pulse skeleton       → animate-pulse
```

---

## 8. Checklist antes de entregar

Antes de considerar cualquier componente terminado, verifica:

- [ ] ¿Funciona en mobile (375px) y desktop (1280px)?
- [ ] ¿Tiene estado de loading?
- [ ] ¿Tiene estado vacío (empty state)?
- [ ] ¿Tiene manejo de error visible para el usuario?
- [ ] ¿Todos los textos usan tokens de color, no valores hardcodeados?
- [ ] ¿Los inputs tienen label accesible?
- [ ] ¿Los botones icon-only tienen aria-label?
- [ ] ¿Hay feedback visual en hover e interacciones?
