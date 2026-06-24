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
  reservationId?: string | number;
  customerEmail?: string;
  products?: object[];
}

export const subject = (props: Props) =>
  `Nueva reserva en ${props.businessName} — #${props.reservationId}`;

const getVal = (p: any, key: string) => p?.get?.(key) ?? p?.[key];

export default function NewReservationEmail({
  name,
  businessName,
  startTime,
  endTime,
  reservationId,
  customerEmail,
  products = [],
}: Props) {
  const localStart = convertUTCDateToLocal(startTime);
  const date = getFormattedLocalDate(localStart);
  const startHour = getFormattedHour(localStart);
  const endHour = endTime ? getFormattedHour(convertUTCDateToLocal(endTime)) : null;

  // Totales calculados a partir de los productos
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
      {/* Header */}
      <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
        Nueva reserva recibida
      </Heading>
      <Text className="text-sm font-medium text-gray-500 mt-0 mb-6">{businessName}</Text>
      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Tienes una nueva reserva pendiente de confirmación en <strong>{businessName}</strong>.
        Revisa los detalles a continuación y confirma o gestiona la cita desde tu panel.
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
      </Section>

      {/* Detalles de la reserva */}
      <Section className="bg-gray-100 rounded-lg p-6 my-4">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Detalles de la reserva
        </Text>
        {reservationId && (
          <Text className="text-sm leading-relaxed text-gray-900 my-1">
            🔖 <strong>ID:</strong> #{reservationId}
          </Text>
        )}
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

      {/* Servicios con imagen, precio y duración */}
      {products.length > 0 && (
        <ReservationProducts products={products as any} />
      )}

      {/* Resumen de totales */}
      {products.length > 0 && (
        <Section className="border border-gray-200 rounded-lg p-6 my-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
            Resumen
          </Text>
          <Row>
            <Column>
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
                Duración total
              </Text>
              <Text className="text-sm font-semibold text-gray-900 mt-0">
                ⏱ {totalDurationStr ?? "—"}
              </Text>
            </Column>
            <Column className="text-right">
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
                Total estimado
              </Text>
              <Text className="text-lg font-bold tracking-tight text-slate-800 mt-0">
                ${totalPrice.toFixed(2)} MXN
              </Text>
            </Column>
          </Row>
        </Section>
      )}

      <Hr className="border-gray-200 my-6" />

      {/* CTA para el owner */}
      <Section className="bg-slate-800 rounded-lg p-6 my-4 text-center">
        <Text className="text-xs font-medium text-white uppercase tracking-wide mt-0 mb-2">
          Acción requerida
        </Text>
        <Text className="text-sm leading-relaxed text-white mt-0 mb-0">
          Ingresa a tu panel para <strong>confirmar</strong> o <strong>gestionar</strong> esta reserva.
          El cliente está esperando tu respuesta.
        </Text>
      </Section>

      <Text className="text-sm text-gray-500 leading-relaxed mt-6">
        Este mensaje fue generado automáticamente al recibir una nueva reserva en {businessName}.
      </Text>
    </EmailLayout>
  );
}
