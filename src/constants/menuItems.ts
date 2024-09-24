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

export type navItemType = {
  label: string;
  icon: React.ElementType;
  path: string;
  surveySet?: 'intro' | 'purpose' | 'moonshot';
};

export const navItems: navItemType[] = [
  {
    label: "Intro",
    icon: PlayIcon,
    path: "/introduction",
    surveySet: 'intro',
  },
  {
    label: "Purpose",
    icon: GoalIcon,
    path: "/purpose",
    surveySet: 'purpose',
  },
  {
    label: "Moonshot",
    icon: RocketIcon,
    path: "/moonshot",
    surveySet: 'moonshot',
  },

  {
    label: "Profile",
    icon: CircleUserIcon,
    path: "/profile",
  },
];
