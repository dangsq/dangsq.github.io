import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shengqi Dang 党圣奇",
  description: "Personal academic website of Shengqi Dang - PhD candidate at Tongji University",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦋</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&family=Orbitron:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@300;400;600&family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
