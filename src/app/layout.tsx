import type { Metadata, Viewport } from "next";
import "./globals.css";
import { pretendard } from "./fonts";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Splitty | 함께 나누는 똑똑한 소비",
  description:
    "필요한 만큼만, 함께 사는 시대. Splitty에서 똑똑하게 소분하고 나눠요.",
  icons: {
    icon: "/splityLogo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="pt-[var(--app-safe-top)] pb-[var(--app-safe-bottom)] bg-white min-h-screen size-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
