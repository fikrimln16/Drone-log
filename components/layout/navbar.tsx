"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Plane,
  Users,
  MapPinned,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

type Props = {
  title: string;

  subtitle?: string;
};

const menus = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },

  {
    name: "Flights",
    href: "/flights",
    icon: Plane,
  },

  {
    name: "Pilot",
    href: "/pilots",
    icon: Users,
  },

  {
    name: "AMA",
    href: "/ama",
    icon: MapPinned,
  },
];

export default function Navbar({ title, subtitle }: Props) {
  const pathname = usePathname();

  const [openMobile, setOpenMobile] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 z-[9999] w-full border-b bg-white/85 backdrop-blur-xl">
        <div className="relative flex h-[82px] items-center justify-between px-4 md:h-[92px] md:px-6">
          {/* LEFT */}
          <div className="flex w-[320px] items-center gap-4">
            {/* LOGO */}
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>

            {/* TITLE */}
            <div className="hidden min-w-0 md:block">
              <h1 className="truncate text-[24px] font-bold tracking-tight text-black">
                {title}
              </h1>

              {subtitle && (
                <p className="truncate text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>

          {/* CENTER NAV */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 p-2 shadow-sm lg:flex">
            {menus.map((item) => {
              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  } `}
                >
                  <Icon
                    className={`h-4 w-4 transition ${
                      active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-black"
                    } `}
                  />

                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="flex w-[320px] items-center justify-end gap-3">
            {/* STATUS */}
            <div className="hidden rounded-2xl border bg-white px-4 py-2 shadow-sm md:block">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Drone System
              </p>

              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />

                <p className="text-sm font-semibold text-black">Operational</p>
              </div>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpenMobile(!openMobile)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm transition hover:bg-gray-100 lg:hidden"
            >
              {openMobile ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {openMobile && (
          <div className="border-t bg-white px-4 py-4 lg:hidden">
            <div className="space-y-2">
              {menus.map((item) => {
                const Icon = item.icon;

                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenMobile(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "border bg-white text-gray-700 hover:bg-gray-100"
                    } `}
                  >
                    <Icon className="h-5 w-5" />

                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
