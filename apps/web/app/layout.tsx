import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400","700"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: "Mera Platform",
  description: "Mera Balıkçılık Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${comfortaa.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
