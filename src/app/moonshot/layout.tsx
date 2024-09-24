import { ProtectUsers } from "@/components/ProtectUsers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectUsers>
      <div className="flex flex-col w-full space-y-5 md:h-full">
        <div className="flex-1">{children}</div>
      </div>
    </ProtectUsers>
  );
}
