import React from "react";
import { Heading, Text, Hr, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

interface Props {
  [key: string]: never;
}

export const subject = (_props: Props) => "Contraseña actualizada correctamente";

export default function ConfirmPasswordHasBeenUpdatedEmail(_props: Props) {
  return (
    <EmailLayout>
      {/* Header */}
      <Section className="text-center mb-6">
        <Text className="text-4xl mt-0 mb-2">✅</Text>
        <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
          Contraseña actualizada
        </Heading>
        <Text className="text-sm font-medium text-gray-500 mt-0 mb-0">
          Tu cuenta está protegida con tu nueva contraseña
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Tu contraseña ha sido actualizada exitosamente. A partir de ahora, usa tu nueva
        contraseña para iniciar sesión en tu cuenta.
      </Text>

      {/* Recomendaciones de seguridad */}
      <Section className="my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
          Buenas prácticas de seguridad
        </Text>

        <Section className="bg-gray-100 rounded-lg p-5 mb-3">
          <Row>
            <Column className="w-8 pr-2">
              <Text className="text-base mt-0 mb-0">🔑</Text>
            </Column>
            <Column>
              <Text className="text-sm leading-relaxed text-gray-900 mt-0 mb-0">
                Usa una contraseña única para esta cuenta, diferente a las que usas en otros
                sitios.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="bg-gray-100 rounded-lg p-5 mb-3">
          <Row>
            <Column className="w-8 pr-2">
              <Text className="text-base mt-0 mb-0">🚫</Text>
            </Column>
            <Column>
              <Text className="text-sm leading-relaxed text-gray-900 mt-0 mb-0">
                Nunca compartas tu contraseña con nadie, ni siquiera con nuestro equipo de
                soporte.
              </Text>
            </Column>
          </Row>
        </Section>

        <Section className="bg-gray-100 rounded-lg p-5">
          <Row>
            <Column className="w-8 pr-2">
              <Text className="text-base mt-0 mb-0">📱</Text>
            </Column>
            <Column>
              <Text className="text-sm leading-relaxed text-gray-900 mt-0 mb-0">
                Cierra sesión en dispositivos que no uses regularmente para mayor seguridad.
              </Text>
            </Column>
          </Row>
        </Section>
      </Section>

      <Hr className="border-gray-200 my-6" />

      {/* Alerta si no fue el usuario */}
      <Section className="bg-red-50 border border-red-100 rounded-lg p-5">
        <Text className="text-xs font-medium text-red-600 uppercase tracking-wide mt-0 mb-3">
          ¿No fuiste tú?
        </Text>
        <Row>
          <Column className="w-6 pr-2">
            <Text className="text-base mt-0 mb-0">🚨</Text>
          </Column>
          <Column>
            <Text className="text-sm leading-relaxed text-red-800 mt-0 mb-0">
              Si <strong>no realizaste este cambio</strong>, tu cuenta pudo haber sido
              comprometida. Contacta a soporte de inmediato para asegurar tu cuenta.
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
}
