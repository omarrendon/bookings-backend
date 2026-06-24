import React from "react";
import { Heading, Text, Hr, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { BusinessContact, BusinessContactInfo } from "./components/BusinessContact";
import { ReservationProducts } from "./components/ReservationProducts";
import { getFormattedLocalDate, getFormattedHour } from "../../../utils/dateUtils";

interface Props {
  name: string;
  businessName: string;
  startTime: string;
  reservationId?: string | number;
  endTime?: string;
  products?: object[];
  toBusiness?: string;
  businessContact?: BusinessContactInfo;
}

export const subject = (props: Props) =>
  `¡Hola, ${props.name}! tu reserva se ha realizado con éxito`;

export default function BookingRegisterEmail({
  name,
  businessName,
  startTime,
  reservationId,
  products,
  businessContact,
}: Props) {
  const date = getFormattedLocalDate(startTime);
  const hour = getFormattedHour(startTime);

  return (
    <EmailLayout>
      <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
        ¡Reserva registrada!
      </Heading>
      <Text className="text-sm font-medium text-gray-500 mt-0 mb-6">{businessName}</Text>
      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Gracias <strong>{name}</strong>, tu reserva en <strong>{businessName}</strong> ha sido
        registrada exitosamente. Recibirás una confirmación una vez que el negocio la apruebe.
      </Text>

      {/* Detalles de la reserva */}
      <Section className="bg-gray-100 rounded-lg p-6 my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Detalles de tu reserva
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
          🕐 <strong>Hora:</strong> {hour}
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          👤 <strong>Nombre:</strong> {name}
        </Text>
      </Section>

      {/* Servicios con precio, duración e imagen */}
      {products && products.length > 0 && (
        <ReservationProducts products={products as any} />
      )}

      <BusinessContact {...businessContact} />

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Si tienes alguna pregunta antes de tu cita, no dudes en contactar al negocio.
      </Text>
    </EmailLayout>
  );
}
