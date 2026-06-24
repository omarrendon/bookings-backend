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

export const subject = (props: Props) => `¡Hola, ${props.name}! Tu cita ha sido reprogramada.`;

export default function BookingRescheduleEmail({
  name,
  businessName,
  startTime,
  endTime,
  products,
  businessContact,
}: Props) {
  const localStart = convertUTCDateToLocal(startTime);
  const date = getFormattedLocalDate(localStart);
  const startHour = getFormattedHour(localStart);
  const endHour = endTime ? getFormattedHour(convertUTCDateToLocal(endTime)) : null;

  return (
    <EmailLayout>
      <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
        Cita Reprogramada
      </Heading>
      <Text className="text-sm font-medium text-gray-500 mt-0 mb-6">{businessName}</Text>
      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        ¡Hola <strong>{name}</strong>! Tu cita ha sido reprogramada y confirmada.
        Aquí están los nuevos detalles:
      </Text>

      {/* Nueva fecha */}
      <Section className="bg-gray-100 rounded-lg p-6 my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
          Nueva fecha y hora
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          📅 <strong>Fecha:</strong> {date}
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          🕐 <strong>Hora de inicio:</strong> {startHour}
        </Text>
        {endHour && (
          <Text className="text-sm leading-relaxed text-gray-900 my-1">
            🕑 <strong>Hora de fin:</strong> {endHour}
          </Text>
        )}
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          👤 <strong>Nombre:</strong> {name}
        </Text>
        <Text className="text-sm leading-relaxed text-gray-900 my-1">
          🏢 <strong>Negocio:</strong> {businessName}
        </Text>
      </Section>

      {/* Servicios con precio, duración e imagen */}
      {products && products.length > 0 && (
        <ReservationProducts products={products as any} />
      )}

      <BusinessContact {...businessContact} />

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Si tienes alguna duda sobre el cambio, comunícate directamente con el negocio.
      </Text>
    </EmailLayout>
  );
}
