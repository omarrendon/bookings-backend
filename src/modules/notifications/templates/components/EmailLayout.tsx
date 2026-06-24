import React from "react";
import { Html, Head, Body, Container, Tailwind } from "@react-email/components";

// Tokens del SKILL mapeados a clases Tailwind estándar (email-safe)
// bg-background  → bg-gray-50   bg-card → bg-white
// text-foreground → text-gray-900   text-muted-foreground → text-gray-500
// border-border  → border-gray-200

export function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Tailwind>
      <Html lang="es">
        <Head />
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white max-w-xl mx-auto my-8 rounded-lg border border-gray-200 p-8">
            {children}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
