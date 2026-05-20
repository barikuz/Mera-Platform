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
  title: {
    default: "Mera",
    template: "%s | Mera",
  },
  description:
    "Mera, balıkçılar için yapay zeka destekli asistan ve balıkçılık ekipmanları e-ticaret platformu. Doğru noktayı bul, doğru ekipmanı seç.",
};

import { QueryProvider } from "@/components/query-provider";
import { CartProvider } from "@/components/cart/cart-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Blocking script: apply saved theme before first paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('mera-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${comfortaa.variable} font-sans antialiased`}>
        <QueryProvider>
          <CartProvider>{children}</CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
