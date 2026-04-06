import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIRECTO | Infraestructura de Ventas por WhatsApp",
  description: "La app descubre. WhatsApp convierte. El restaurante retiene. Activa tu vendedor con IA en minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased dark"
    >
      <body className="bg-background text-foreground min-h-full flex flex-col selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
