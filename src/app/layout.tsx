import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/components/ClientProvider";
import Header from "@/components/layout/Header";
import BottomBar from "@/components/layout/BottomBar";

export const metadata: Metadata = {
  title: "Purpose Finder",
  description:
    "Purpose Finder: A tool to help you find your Massive Transformative Purpose (MTP) and put you on a path to defining and launching your Moonshot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=contain, user-scalable=no, maximum-scale=1"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <ClientProvider>
          <div className="flex flex-col h-full">
            <Header />
            <div className="flex flex-col h-container-small md:h-container-custom overflow-y-auto">
              <div className="flex flex-col h-full flex-1">{children}</div>
            </div>
            <BottomBar />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
