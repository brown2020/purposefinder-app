import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      {children}
    </div>
  );
}
