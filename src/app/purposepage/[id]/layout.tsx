export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:mb-0 flex flex-col h-container-small sm:h-container-custom w-full space-y-5 overflow-y-scroll">
      <div className="flex-1">{children}</div>
    </div>
  );
}
