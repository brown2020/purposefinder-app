"use client";

import { useRouter } from "next/navigation";
import logo from "@/app/assets/logo512t.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, navItemType } from "@/constants/menuItems";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (item: navItemType) => {
    router.push(item.path);
  };

  return (
    <div className="z-10 flex items-center justify-between h-16 px-4 bg-blue-800">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("refresh");
          } else {
            console.log("Not React Native WebView environment");
          }
          router.push("/");
        }}
      >
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          className="h-9 w-9 object-cover"
        />
        <div className="text-2xl uppercase whitespace-nowrap text-white">
          Purpose Finder
        </div>
      </div>
      <div className="flex h-full gap-2 opacity-0 md:opacity-100 items-center">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-3 h-full transition duration-300 cursor-pointer text-white hover:opacity-100 ${pathname === (item.surveySet ? "/dynamicsurvey" : item.path)
                ? "opacity-50 "
                : "opacity-50"
              }`}
            onClick={() => handleNavigation(item)}
          >
            <div className="h-9 aspect-square">
              <item.icon size={30} className="h-full w-full object-cover" />
            </div>
            <div className="text-lx font-bold">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}