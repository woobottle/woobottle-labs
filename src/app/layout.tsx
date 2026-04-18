import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WooBottle Labs",
  description: "일상과 업무를 위한 작은 도구 모음",
  keywords: "생산성, 도구, 글자수, 계산기, 변환기, 타이머",
  authors: [{ name: "WooBottle Labs" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WooBottle Labs",
  },
  openGraph: {
    title: "WooBottle Labs",
    description: "일상과 업무를 위한 작은 도구 모음",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script src="/version.js" async />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="WooBottle Labs" />
        <link rel="apple-touch-icon" href="/pwa/icon-192x192.svg" />
        <script src="/register-sw.js" async />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
