import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { trTR } from "@clerk/localizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Asistan | Kendi Yapay Zeka Asistanını Oluştur",
  description: "Modern SaaS platformu ile teknik bilgiye ihtiyaç duymadan kendi AI asistanınızı oluşturun, eğitin ve kullanın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={trTR}>
      <html lang="tr">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
