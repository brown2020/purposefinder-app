"use client";

import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants/menuItems";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center z-20 h-16 justify-between md:hidden bg-blue-800 overflow-hidden shadow-lg"
      aria-label="Mobile navigation"
    >
      {navItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col items-center px-3 py-2 grow cursor-pointer text-white hover:bg-blue-700 transition-colors duration-300 ${
            pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
              ? "opacity-100 bg-blue-700"
              : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => {
            setTimeout(() => router.push(item.path), 100);
          }}
          role="button"
          tabIndex={0}
          aria-label={`Go to ${item.label} page`}
          aria-current={
            pathname.slice(0, 5) === item.path.slice(0, 5) && pathname !== "/"
              ? "page"
              : undefined
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setTimeout(() => router.push(item.path), 100);
            }
          }}
        >
          <div className="h-9 aspect-square">
            <item.icon
              size={30}
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="text-xs">{item.label}</div>
        </div>
      ))}
    </nav>
  );
}
