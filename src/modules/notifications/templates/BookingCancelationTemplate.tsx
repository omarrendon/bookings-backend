import React from "react";
import { Heading, Text, Hr, Section } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";
import { BusinessContact, BusinessContactInfo } from "./components/BusinessContact";
import { ReservationProducts } from "./components/ReservationProducts";
import { convertUTCDateToLocal, getFormattedLocalDate, getFormattedHour } from "../../../utils/dateUtils";

interface Props {
  name: string;
  businessName: string;
  startTime: string;
  endTime?: string;
  status?: string;
  products?: object[];
  businessContact?: BusinessContactInfo;
}

export const subject = (props: Props) => `Reserva cancelada — ${props.businessName}`;

export default function BookingCancelationEmail({
  name,
  businessName,
  startTime,
  products,
  businessContact,
}: Props) {
  const local = convertUTCDateToLocal(startTime);
  const date = getFormattedLocalDate(local);
  const hour = getFormattedHour(local);

  return (
    <EmailLayout>
      <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
        Reserva Cancelada
      </Heading>
      <Text className="text-sm font-medium text-gray-500 mt-0 mb-6">{businessName}</Text>
      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Estimado/a <strong>{name}</strong>, tu reserva en <strong>{businessName}</strong> ha
        sido cancelada.
      </Text>

      {/* Detalles de la reserva cancelada */}
      <Section className="bg-gray-100 rounded-lg p-6 my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Detalles de la reserva cancelada
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          📅 <strong>Fecha:</strong> {date}
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          🕐 <strong>Hora:</strong> {hour}
        </Text>
      </Section>

      {/* Servicios que se habían reservado */}
      {products && products.length > 0 && (
        <ReservationProducts products={products as any} />
      )}

      <BusinessContact {...businessContact} />

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Si deseas reagendar tu cita, comunícate con el negocio usando los datos de contacto
        indicados arriba.
      </Text>
    </EmailLayout>
  );
}
