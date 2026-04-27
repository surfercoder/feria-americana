import { ViewTransition } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./cart-context";
import SoldNotifications from "./SoldNotifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://feriaamericana.com"),
  title: {
    default: "Feria Americana | Moda para mujer, hombre y niños",
    template: "%s | Feria Americana",
  },
  description:
    "Explorá ropa y accesorios de segunda mano en Feria Americana. Moda para mujer, hombre y niños.",
  openGraph: {
    title: "Feria Americana",
    description:
      "Explorá ropa y accesorios de segunda mano en Feria Americana. Moda para mujer, hombre y niños.",
    url: "https://feriaamericana.com",
    siteName: "Feria Americana",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feria Americana",
    description:
      "Explorá ropa y accesorios de segunda mano en Feria Americana. Moda para mujer, hombre y niños.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <CartProvider>
          <SoldNotifications />
          <div className="min-h-screen">
            <ViewTransition>{children}</ViewTransition>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
