"use client";

import { useRouter } from "next/navigation";
import logo from "@/app/assets/logo512t.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems, navItemType } from "@/constants/menuItems";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (item: navItemType) => {
    router.push(item.path);
  };

  return (
    <header
      className={`z-10 flex items-center justify-between h-16 px-4 bg-blue-800 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      role="banner"
    >
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
        role="button"
        tabIndex={0}
        aria-label="Go to home page"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push("/");
          }
        }}
      >
        <Image
          src={logo}
          alt="Purpose Finder logo"
          width={100}
          height={100}
          className="h-9 w-9 object-cover"
          priority
        />
        <div className="text-2xl uppercase whitespace-nowrap text-white">
          Purpose Finder
        </div>
      </div>
      <nav
        className="flex h-full gap-2 opacity-0 md:opacity-100 items-center"
        aria-label="Main navigation"
      >
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-1 px-3 h-full transition duration-300 cursor-pointer text-white hover:bg-blue-700 ${
              pathname === (item.surveySet ? "/dynamicsurvey" : item.path)
                ? "bg-blue-700 opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => handleNavigation(item)}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${item.label} page`}
            aria-current={
              pathname === (item.surveySet ? "/dynamicsurvey" : item.path)
                ? "page"
                : undefined
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleNavigation(item);
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
            <div className="text-lx font-bold">{item.label}</div>
          </div>
        ))}
      </nav>
    </header>
  );
}
