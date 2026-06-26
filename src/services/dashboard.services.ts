import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../database/sequelize";
import Reservation from "../models/reservation.model";

function calcGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

export async function getBusinessDashboard(
  business_id: string | number,
  period: 7 | 30 | 90 = 30,
) {
  const now = new Date();

  // Ventanas de 30 días
  const last30Start = new Date(now);
  last30Start.setDate(last30Start.getDate() - 30);

  const prev30Start = new Date(now);
  prev30Start.setDate(prev30Start.getDate() - 60);

  // Mes calendario actual vs anterior
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const revenueQuery = `
    SELECT COALESCE(SUM(p.price * rp.quantity), 0) AS total
    FROM reservations r
    JOIN reservation_products rp ON rp.reservation_id = r.id
    JOIN products p ON p.id = rp.product_id
    WHERE r.business_id = :business_id
      AND r.status = 'completed'
      AND r.start_time >= :start_date
      AND r.start_time < :end_date
  `;

  const uniqueCustomersQuery = `
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE business_id = :business_id
      AND created_at >= :start_date
      AND created_at < :end_date
  `;

  // Ventana dinámica por period
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - period);

  const [
    currentReservations,
    previousReservations,
    currentRevenueRows,
    lastMonthRevenueRows,
    currentCustomersRows,
    previousCustomersRows,
    reservationsByStatus,
  ] = await Promise.all([
    // Reservas últimos 30 días
    Reservation.count({
      where: {
        business_id,
        created_at: { [Op.gte]: last30Start },
      },
    }),
    // Reservas 30 días previos
    Reservation.count({
      where: {
        business_id,
        created_at: { [Op.gte]: prev30Start, [Op.lt]: last30Start },
      },
    }),
    // Ingresos mes actual (completadas)
    sequelize.query<{ total: string }>(revenueQuery, {
      replacements: {
        business_id,
        start_date: currentMonthStart,
        end_date: nextMonthStart,
      },
      type: QueryTypes.SELECT,
    }),
    // Ingresos mes anterior (completadas)
    sequelize.query<{ total: string }>(revenueQuery, {
      replacements: {
        business_id,
        start_date: lastMonthStart,
        end_date: currentMonthStart,
      },
      type: QueryTypes.SELECT,
    }),
    // Clientes únicos últimos 30 días (todos los status)
    sequelize.query<{ total: string }>(uniqueCustomersQuery, {
      replacements: {
        business_id,
        start_date: last30Start,
        end_date: now,
      },
      type: QueryTypes.SELECT,
    }),
    // Clientes 30 días previos (todos los status)
    sequelize.query<{ total: string }>(uniqueCustomersQuery, {
      replacements: {
        business_id,
        start_date: prev30Start,
        end_date: last30Start,
      },
      type: QueryTypes.SELECT,
    }),
    // Reservas por status en el periodo solicitado
    Reservation.findAll({
      where: {
        business_id,
        status: { [Op.in]: ["pending", "confirmed", "cancelled"] },
        created_at: { [Op.gte]: periodStart },
      },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
      ],
      group: ["status"],
      raw: true,
    }),
  ]);

  const currentRevenue = parseFloat(currentRevenueRows[0]?.total ?? "0");
  const lastMonthRevenue = parseFloat(lastMonthRevenueRows[0]?.total ?? "0");
  const currentCustomers = parseInt(currentCustomersRows[0]?.total ?? "0", 10);
  const previousCustomers = parseInt(previousCustomersRows[0]?.total ?? "0", 10);

  const statusMap = { pending: 0, confirmed: 0, cancelled: 0 };
  for (const row of reservationsByStatus as unknown as { status: string; total: string }[]) {
    if (row.status in statusMap) {
      statusMap[row.status as keyof typeof statusMap] = parseInt(row.total, 10);
    }
  }

  return {
    reservations: {
      current_period: currentReservations,
      previous_period: previousReservations,
      growth_percentage: calcGrowth(currentReservations, previousReservations),
      period_label: "Últimos 30 días",
    },
    revenue: {
      current_month: currentRevenue,
      last_month: lastMonthRevenue,
      growth_percentage: calcGrowth(currentRevenue, lastMonthRevenue),
      currency: "MXN",
      period_label: "Mes calendario actual vs anterior",
    },
    customers: {
      current_period: currentCustomers,
      previous_period: previousCustomers,
      growth_percentage: calcGrowth(currentCustomers, previousCustomers),
      period_label: "Últimos 30 días",
    },
    reservations_by_status: {
      period_days: period,
      pending: statusMap.pending,
      confirmed: statusMap.confirmed,
      cancelled: statusMap.cancelled,
    },
  };
}
