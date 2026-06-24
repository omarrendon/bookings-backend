import React from "react";
import { Text } from "@react-email/components";

interface Product {
  name?: string;
  get?: (key: string) => string;
}

export function ProductList({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;
  return (
    <>
      {products.map((p, i) => (
        <Text key={i} className="text-sm leading-relaxed text-gray-700 my-1">
          • {p.name ?? p.get?.("name") ?? "Servicio"}
        </Text>
      ))}
    </>
  );
}
