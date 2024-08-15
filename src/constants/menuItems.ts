import { CircleUserIcon, GoalIcon, PlayIcon, RocketIcon } from "lucide-react";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "About",
    href: "/about",
    show: "everyone",
    header: false,
    footer: true,
  },

  {
    label: "Terms",
    href: "/terms",
    show: "everyone",
    header: false,
    footer: true,
  },
  {
    label: "Privacy",
    href: "/privacy",
    show: "everyone",
    header: false,
    footer: true,
  },
];

type navItemType = {
  label: string;
  icon: React.ElementType;
  path: string;
};

export const navItems: navItemType[] = [
  {
    label: "Intro",
    icon: PlayIcon,
    path: "/introrouter/identify",
  },
  {
    label: "Purpose",
    icon: GoalIcon,
    path: "/purposerouter/intro",
  },
  {
    label: "Moonshot",
    icon: RocketIcon,
    path: "/moonshotrouter/intro",
  },

  {
    label: "Profile",
    icon: CircleUserIcon,
    path: "/profile",
  },
];
