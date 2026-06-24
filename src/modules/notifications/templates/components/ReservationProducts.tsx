import React from "react";
import { Section, Row, Column, Img, Text } from "@react-email/components";

interface ProductItem {
  name?: string;
  price?: number | string;
  estimated_delivery_time?: number | string;
  gallery_images?: Array<{ url?: string } | string> | null;
  ReservationProduct?: { quantity?: number };
  get?: (key: string) => unknown;
}

const field = (p: ProductItem, key: string): unknown =>
  p?.get?.(key) ?? (p as Record<string, unknown>)[key];

const formatDuration = (minutes: number): string => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m} min`;
  if (h > 0) return `${h}h`;
  return `${m} min`;
};

const getImageUrl = (galleryImages: unknown): string | null => {
  if (!Array.isArray(galleryImages) || !galleryImages.length) return null;
  const first = galleryImages[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first !== null && "url" in first) return (first as { url: string }).url;
  return null;
};

export function ReservationProducts({ products }: { products: ProductItem[] }) {
  if (!products?.length) return null;

  return (
    <Section className="my-6">
      {/* Label de sección — text-xs font-medium uppercase tracking-wide del SKILL */}
      <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0 mb-4">
        Servicios reservados
      </Text>

      {products.map((product, i) => {
        const name = String(field(product, "name") ?? "Servicio");
        const price = parseFloat(String(field(product, "price") ?? 0));
        const duration = parseFloat(String(field(product, "estimated_delivery_time") ?? 0));
        const galleryImages = field(product, "gallery_images");
        const imageUrl = getImageUrl(galleryImages);
        const quantity: number =
          (product?.ReservationProduct?.quantity as number) ??
          (field(product, "ReservationProduct") as { quantity?: number } | null)?.quantity ??
          1;
        const durationStr = formatDuration(duration);

        return (
          <Section
            key={i}
            className="bg-gray-100 rounded-lg p-4 mb-3 border border-gray-200"
          >
            <Row>
              {/* Imagen del servicio */}
              {imageUrl && (
                <Column className="w-20 pr-4">
                  <Img
                    src={imageUrl}
                    width={64}
                    height={64}
                    alt={name}
                    className="rounded-lg"
                    style={{ objectFit: "cover", display: "block" }}
                  />
                </Column>
              )}

              {/* Detalles del servicio */}
              <Column>
                {/* Nombre del servicio — heading tarjeta del SKILL */}
                <Text className="text-sm font-semibold text-gray-900 mt-0 mb-1">{name}</Text>

                {/* Precio — acento primario */}
                <Text className="text-sm font-medium text-slate-800 mt-0 mb-1">
                  ${price.toFixed(2)} MXN
                </Text>

                {/* Duración + cantidad — subtítulo del SKILL */}
                <Text className="text-xs font-medium text-gray-500 mt-0 mb-0">
                  {durationStr && `⏱ ${durationStr}`}
                  {durationStr && quantity > 1 && "  ·  "}
                  {quantity > 1 && `✕ ${quantity}`}
                </Text>
              </Column>
            </Row>
          </Section>
        );
      })}
    </Section>
  );
}
