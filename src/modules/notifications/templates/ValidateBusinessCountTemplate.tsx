import React from "react";
import { Heading, Text, Hr, Link, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

interface Props {
  userId: string;
}

export const subject = (_props: Props) => "¡Tu cuenta está lista! Configura tu negocio";

export default function ValidateBusinessCountEmail({ userId }: Props) {
  const url = `${process.env.DEVELOPMENT_FRONTEND_URL}/${userId}`;

  return (
    <EmailLayout>
      {/* Header de bienvenida */}
      <Section className="text-center mb-6">
        <Text className="text-4xl mt-0 mb-2">🚀</Text>
        <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
          ¡Tu cuenta está lista!
        </Heading>
        <Text className="text-sm font-medium text-gray-500 mt-0 mb-0">
          Un solo paso te separa de recibir tus primeras reservaciones
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Tu cuenta ha sido creada exitosamente. Para empezar a recibir reservaciones en línea,
        configura los datos de tu negocio: nombre, servicios, horarios y datos de contacto.
      </Text>

      {/* Lo que obtienes */}
      <Section className="my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
          Con tu cuenta puedes
        </Text>

        <Section className="mb-3">
          <Row>
            <Column className="w-8 pr-3">
              <Text className="text-base mt-0 mb-0">📅</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-0">
                Gestionar reservaciones en línea
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-1 mb-0">
                Recibe, confirma y administra las citas de tus clientes desde un solo lugar.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="mb-3">
          <Row>
            <Column className="w-8 pr-3">
              <Text className="text-base mt-0 mb-0">⏰</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-0">
                Control total de tu agenda
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-1 mb-0">
                Define tus horarios de atención y la duración de cada servicio.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="mb-3">
          <Row>
            <Column className="w-8 pr-3">
              <Text className="text-base mt-0 mb-0">📲</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-0">
                Notificaciones automáticas
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-1 mb-0">
                Tus clientes reciben confirmaciones y recordatorios por email automáticamente.
              </Text>
            </Column>
          </Row>
        </Section>
      </Section>

      {/* CTA principal */}
      <Section className="bg-slate-800 rounded-lg p-6 my-6 text-center">
        <Text className="text-xs font-medium text-gray-400 uppercase tracking-wide mt-0 mb-3">
          Comienza ahora
        </Text>
        <Link
          href={url}
          className="inline-block bg-white text-slate-800 text-sm font-medium px-8 py-3 rounded-lg no-underline"
        >
          Configurar mi negocio →
        </Link>
      </Section>

      {/* URL alternativa */}
      <Section className="bg-gray-100 rounded-lg p-5 my-4">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-2">
          O copia este enlace en tu navegador
        </Text>
        <Text className="text-sm text-gray-500 leading-relaxed break-all mt-0 mb-0">
          {url}
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Si tienes alguna duda durante la configuración, nuestro equipo está disponible para
        ayudarte. ¡Bienvenido!
      </Text>
    </EmailLayout>
  );
}
