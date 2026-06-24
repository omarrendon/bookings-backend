import React from "react";
import { Heading, Text, Hr, Link, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

interface Props {
  resetLink: string;
}

export const subject = (_props: Props) => "Recuperación de contraseña";

export default function PasswordResetEmail({ resetLink }: Props) {
  const url = `${process.env.HOST}/${resetLink}`;

  return (
    <EmailLayout>
      {/* Header */}
      <Section className="text-center mb-6">
        <Text className="text-4xl mt-0 mb-2">🔐</Text>
        <Heading className="text-3xl font-bold tracking-tight text-gray-900 mt-0 mb-2">
          Recuperación de contraseña
        </Heading>
        <Text className="text-sm font-medium text-gray-500 mt-0 mb-0">
          Recibimos una solicitud para restablecer tu contraseña
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />

      <Text className="text-sm leading-relaxed text-gray-900">
        Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace es válido
        por <strong>15 minutos</strong> y solo puede usarse una vez.
      </Text>

      {/* CTA principal */}
      <Section className="text-center my-8">
        <Link
          href={url}
          className="inline-block bg-slate-800 text-white text-sm font-medium px-8 py-3 rounded-lg no-underline"
        >
          Restablecer mi contraseña →
        </Link>
      </Section>

      {/* URL alternativa */}
      <Section className="bg-gray-100 rounded-lg p-5 my-6">
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-2">
          O copia este enlace en tu navegador
        </Text>
        <Text className="text-sm text-gray-500 leading-relaxed break-all mt-0 mb-0">
          {url}
        </Text>
      </Section>

      <Hr className="border-gray-200 my-6" />

      {/* Aviso de seguridad */}
      <Section className="bg-amber-50 border border-amber-100 rounded-lg p-5">
        <Text className="text-xs font-medium text-amber-700 uppercase tracking-wide mt-0 mb-3">
          Aviso de seguridad
        </Text>
        <Row>
          <Column className="w-6 pr-2">
            <Text className="text-base mt-0 mb-0">⚠️</Text>
          </Column>
          <Column>
            <Text className="text-sm leading-relaxed text-amber-800 mt-0 mb-0">
              Si <strong>no solicitaste</strong> este cambio, ignora este mensaje. Tu contraseña
              actual seguirá siendo la misma. Nunca compartas este enlace con nadie.
            </Text>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  );
}
