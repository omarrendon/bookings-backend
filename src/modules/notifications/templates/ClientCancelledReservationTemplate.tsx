import React from "react";
import { Heading, Text, Hr, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { ReservationProducts } from "./components/ReservationProducts";
import { convertUTCDateToLocal, getFormattedLocalDate, getFormattedHour } from "../../../utils/dateUtils";

interface Props {
  name: string;
  businessName: string;
  startTime: string;
  endTime?: string;
  status?: string;
  products?: object[];
  customerEmail?: string;
  reservationId?: string | number;
}

export const subject = (props: Props) =>
  `Reservación cancelada — ${props.name} (#${props.reservationId ?? "—"})`;

const getVal = (p: any, key: string) => p?.get?.(key) ?? p?.[key];

export default function ClientCancelledReservationEmail({
  name,
  businessName,
  startTime,
  endTime,
  products = [],
  customerEmail,
  reservationId,
}: Props) {
  const localStart = convertUTCDateToLocal(startTime);
  const date = getFormattedLocalDate(localStart);
  const startHour = getFormattedHour(localStart);
  const endHour = endTime ? getFormattedHour(convertUTCDateToLocal(endTime)) : null;

  // Ingreso estimado liberado
  const totalPrice = products.reduce((sum, p) => {
    const price = parseFloat(String(getVal(p, "price") ?? 0));
    const qty = (p as any)?.ReservationProduct?.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  const totalMinutes = products.reduce((sum, p) => {
    return sum + parseFloat(String(getVal(p, "estimated_delivery_time") ?? 0));
  }, 0);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = Math.round(totalMinutes % 60);
  const totalDurationStr =
    totalMinutes > 0
      ? totalHours > 0
        ? `${totalHours}h ${remainingMin > 0 ? `${remainingMin} min` : ""}`
        : `${remainingMin} min`
      : null;

  return (
    <EmailLayout>
      {/* Header con indicador visual de cancelación */}
      <Section className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6 text-center">
        <Text className="text-xs font-medium text-red-500 uppercase tracking-wide mt-0 mb-2">
          Reservación cancelada
        </Text>
        <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-1">
          Una cita fue cancelada
        </Heading>
        <Text className="text-sm font-medium text-gray-500 mt-0 mb-0">
          {businessName}
        </Text>
      </Section>

      <Text className="text-sm leading-relaxed text-gray-900">
        La reservación de <strong>{name}</strong> ha sido cancelada. El horario ha quedado
        disponible nuevamente y puede ser ocupado por otro cliente.
      </Text>

      {/* Datos del cliente */}
      <Section className="bg-gray-100 rounded-lg p-6 my-4">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Datos del cliente
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          👤 <strong>Nombre:</strong> {name}
        </Text>
        {customerEmail && (
          <Text className="text-sm leading-relaxed text-gray-900 my-1">
            ✉️ <strong>Email:</strong> {customerEmail}
          </Text>
        )}
        {reservationId && (
          <Text className="text-sm leading-relaxed text-gray-900 my-1">
            🔖 <strong>Reserva ID:</strong> #{reservationId}
          </Text>
        )}
      </Section>

      {/* Franja horaria liberada */}
      <Section className="bg-gray-100 rounded-lg p-6 my-4">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Horario liberado
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          📅 <strong>Fecha:</strong> {date}
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          🕐 <strong>Inicio:</strong> {startHour}
        </Text>
        {endHour && (
          <Text className="text-sm leading-relaxed text-gray-900 my-1">
            🕑 <strong>Fin:</strong> {endHour}
          </Text>
        )}
      </Section>

      {/* Servicios cancelados con imagen, precio y duración */}
      {products.length > 0 && (
        <ReservationProducts products={products as any} />
      )}

      {/* Impacto económico */}
      {products.length > 0 && (
        <Section className="border border-gray-200 rounded-lg p-6 my-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
            Impacto de la cancelación
          </Text>
          <Row>
            <Column>
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
                Tiempo liberado
              </Text>
              <Text className="text-sm font-semibold text-gray-900 mt-0">
                ⏱ {totalDurationStr ?? "—"}
              </Text>
            </Column>
            <Column className="text-right">
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
                Ingreso no generado
              </Text>
              <Text className="text-lg font-bold tracking-tight text-red-500 mt-0">
                −${totalPrice.toFixed(2)} MXN
              </Text>
            </Column>
          </Row>
        </Section>
      )}

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Puedes reasignar este horario desde tu panel de control. Si necesitas contactar al
        cliente, su información aparece en los datos de arriba.
      </Text>
    </EmailLayout>
  );
}
