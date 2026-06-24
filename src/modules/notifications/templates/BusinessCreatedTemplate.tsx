import React from "react";
import { Heading, Text, Hr, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

interface Props {
  businessName: string;
}

export const subject = (props: Props) =>
  `¡Tu negocio "${props.businessName}" fue creado con éxito!`;

export default function BusinessCreatedEmail({ businessName }: Props) {
  return (
    <EmailLayout>
      {/* Header celebratorio */}
      <Section className="text-center mb-6">
        <Text className="text-4xl mt-0 mb-2">🎉</Text>
        <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
          ¡Bienvenido a bordo!
        </Heading>
        <Text className="text-sm font-medium text-gray-500 mt-0 mb-0">
          {businessName} ya es parte de nuestra plataforma
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Tu negocio <strong>{businessName}</strong> ha sido registrado exitosamente. Ya puedes
        empezar a configurar todo lo necesario para recibir tus primeras reservaciones.
      </Text>

      {/* Pasos de configuración */}
      <Section className="my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
          Próximos pasos
        </Text>

        <Section className="bg-gray-100 rounded-lg p-5 mb-3">
          <Row>
            <Column className="w-10">
              <Text className="text-xl mt-0 mb-0">🛍️</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-1">
                1. Agrega tus servicios
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-0 mb-0">
                Crea los servicios que ofreces, con precio y tiempo estimado de atención.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="bg-gray-100 rounded-lg p-5 mb-3">
          <Row>
            <Column className="w-10">
              <Text className="text-xl mt-0 mb-0">🗓️</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-1">
                2. Configura tus horarios
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-0 mb-0">
                Define los días y horas en que recibes clientes para que puedan reservar
                en línea.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="bg-gray-100 rounded-lg p-5 mb-3">
          <Row>
            <Column className="w-10">
              <Text className="text-xl mt-0 mb-0">📸</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-1">
                3. Añade imágenes y datos de contacto
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-0 mb-0">
                Una imagen atractiva y tus redes sociales generan más confianza y reservaciones.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="bg-gray-100 rounded-lg p-5">
          <Row>
            <Column className="w-10">
              <Text className="text-xl mt-0 mb-0">✅</Text>
            </Column>
            <Column>
              <Text className="text-sm font-semibold text-gray-900 mt-0 mb-1">
                4. ¡Listo para recibir clientes!
              </Text>
              <Text className="text-sm leading-relaxed text-gray-500 mt-0 mb-0">
                Una vez configurado, tus clientes podrán reservar directamente desde tu
                perfil público.
              </Text>
            </Column>
          </Row>
        </Section>
      </Section>

      <Hr className="border-gray-200 my-6" />
      <Text className="text-sm text-gray-500 leading-relaxed">
        Si tienes dudas durante la configuración, nuestro equipo está disponible para ayudarte.
        ¡Mucho éxito con <strong>{businessName}</strong>!
      </Text>
    </EmailLayout>
  );
}
