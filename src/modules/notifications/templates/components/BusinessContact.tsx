import React from "react";
import { Section, Text, Link, Hr, Row, Column } from "@react-email/components";

export interface BusinessContactInfo {
  phone?: string;
  address?: string;
  mapsUrl?: string;
  website?: string;
  socialLinks?: Record<string, unknown> | unknown[];
}

interface SocialPlatform {
  name: string;
  emoji: string;
  bgColor: string;
  textColor: string;
}

// Extrae una URL string de cualquier formato de entrada
const extractUrl = (value: unknown): string | null => {
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const candidate = obj.url ?? obj.href ?? obj.link ?? obj.value;
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }
  return null;
};

// Detecta la plataforma desde la URL (funciona con arrays o claves numéricas)
const detectPlatform = (url: string): SocialPlatform => {
  const lower = String(url).toLowerCase();
  if (lower.includes("facebook.com") || lower.includes("fb.com"))
    return { name: "Facebook", emoji: "f", bgColor: "#1877F2", textColor: "#ffffff" };
  if (lower.includes("instagram.com"))
    return { name: "Instagram", emoji: "◈", bgColor: "#E4405F", textColor: "#ffffff" };
  if (lower.includes("twitter.com") || lower.includes("x.com"))
    return { name: "Twitter / X", emoji: "𝕏", bgColor: "#000000", textColor: "#ffffff" };
  if (lower.includes("tiktok.com"))
    return { name: "TikTok", emoji: "♪", bgColor: "#010101", textColor: "#ffffff" };
  if (lower.includes("wa.me") || lower.includes("whatsapp.com"))
    return { name: "WhatsApp", emoji: "✆", bgColor: "#25D366", textColor: "#ffffff" };
  if (lower.includes("youtube.com") || lower.includes("youtu.be"))
    return { name: "YouTube", emoji: "▶", bgColor: "#FF0000", textColor: "#ffffff" };
  if (lower.includes("linkedin.com"))
    return { name: "LinkedIn", emoji: "in", bgColor: "#0A66C2", textColor: "#ffffff" };
  if (lower.includes("pinterest.com"))
    return { name: "Pinterest", emoji: "P", bgColor: "#BD081C", textColor: "#ffffff" };
  if (lower.includes("snapchat.com"))
    return { name: "Snapchat", emoji: "👻", bgColor: "#FFFC00", textColor: "#000000" };
  return { name: "Ver enlace", emoji: "↗", bgColor: "#6B7280", textColor: "#ffffff" };
};

// Normaliza social_links a un array de URLs string válidas
// Maneja: string[], Record<string,string>, Record<string,object>, objetos con .url, etc.
const normalizeSocialLinks = (
  socialLinks: Record<string, unknown> | unknown[],
): string[] => {
  const raw = Array.isArray(socialLinks)
    ? socialLinks
    : Object.values(socialLinks);

  return raw
    .map(extractUrl)
    .filter((url): url is string => url !== null);
};

export function BusinessContact({
  phone,
  address,
  mapsUrl,
  website,
  socialLinks,
}: BusinessContactInfo) {
  const hasSocials =
    socialLinks &&
    (Array.isArray(socialLinks)
      ? socialLinks.length > 0
      : Object.keys(socialLinks).length > 0);

  const hasAnyContact = phone || address || website || hasSocials;
  if (!hasAnyContact) return null;

  const socialUrls = hasSocials ? normalizeSocialLinks(socialLinks!) : [];

  return (
    <>
      <Hr className="border-gray-200 my-6" />
      <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
        Información del negocio
      </Text>

      {/* Teléfono */}
      {phone && (
        <Section className="mb-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
            Teléfono
          </Text>
          <Link
            href={`tel:${phone}`}
            className="text-sm text-slate-800 font-medium no-underline"
          >
            📞 {phone}
          </Link>
        </Section>
      )}

      {/* Dirección + mapa */}
      {address && (
        <Section className="mb-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
            Ubicación
          </Text>
          <Text className="text-sm leading-relaxed text-gray-900 mt-0 mb-2">
            📍 {address}
          </Text>
          {mapsUrl && (
            <Link
              href={mapsUrl}
              className="inline-block bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg no-underline"
            >
              Ver en Google Maps →
            </Link>
          )}
        </Section>
      )}

      {/* Sitio web */}
      {website && (
        <Section className="mb-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-1">
            Sitio web
          </Text>
          <Link
            href={website}
            className="text-sm text-slate-800 font-medium no-underline"
          >
            🌐 {website}
          </Link>
        </Section>
      )}

      {/* Redes sociales — badges con color de marca detectado desde la URL */}
      {hasSocials && socialUrls.length > 0 && (
        <Section className="mb-2">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-3">
            Redes sociales
          </Text>
          <Row>
            {socialUrls.map((url, i) => {
              const platform = detectPlatform(url);
              return (
                <Column key={i} className="pr-2 pb-2" style={{ width: "auto" }}>
                  <Link
                    href={url}
                    style={{
                      display: "inline-block",
                      backgroundColor: platform.bgColor,
                      color: platform.textColor,
                      padding: "8px 14px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {platform.emoji}&nbsp;&nbsp;{platform.name}
                  </Link>
                </Column>
              );
            })}
          </Row>
        </Section>
      )}
    </>
  );
}
