"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { cn } from "@/lib/cn";
import type { AuthUser, UserRole } from "@/types";

export interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
  superadminOnly?: boolean;
}

const icons = {
  dashboard: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  folder: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  doc: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chat: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  building: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  list: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  cog: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function buildNavLinks(): SidebarLink[] {
  return [
    { href: "/dashboard", label: "Dashboard", icon: icons.dashboard },
    { href: "/dashboard/projects", label: "Projects", icon: icons.folder },
    { href: "/dashboard/blogs", label: "Blogs", icon: icons.doc },
    { href: "/dashboard/testimonials", label: "Testimonials", icon: icons.chat },
    { href: "/dashboard/clients", label: "Clients", icon: icons.building },
    { href: "/dashboard/records", label: "Records", icon: icons.list },
    {
      href: "/dashboard/site-data",
      label: "Site Data",
      icon: icons.cog,
      superadminOnly: true,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: icons.users,
      superadminOnly: true,
    },
  ];
}

export function Sidebar({
  role,
  user,
  className,
}: {
  role: UserRole;
  user: AuthUser;
  className?: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = buildNavLinks().filter(
    (l) => !l.superadminOnly || role === 1,
  );

  const aside = (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-stone-200 bg-[#f4f1eb] transition-[width] duration-200 ease-out",
        collapsed ? "w-[72px]" : "w-[240px]",
        className,
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-stone-200/80 px-3">
        {!collapsed ? (
          <Link href="/dashboard" className="truncate font-semibold text-stone-900">
            ABS CMS
          </Link>
        ) : (
          <span className="sr-only">ABS CMS</span>
        )}
        <button
          type="button"
          className="rounded-md p-2 text-stone-600 hover:bg-stone-200/80"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            {collapsed ? (
              <path strokeWidth={1.5} strokeLinecap="round" d="M9 5l7 7-7 7" />
            ) : (
              <path strokeWidth={1.5} strokeLinecap="round" d="M15 5l-7 7 7 7" />
            )}
          </svg>
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 pb-3">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? link.label : undefined}
            >
              <span className="shrink-0 text-stone-500">{link.icon}</span>
              {!collapsed ? <span>{link.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div
        className={cn(
          "mt-auto border-t border-stone-200/80 p-2",
          collapsed && "flex justify-center",
        )}
      >
        <ProfileMenu user={user} compact={collapsed} />
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-[#faf8f5] shadow-sm md:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div
        className={cn(
          "fixed inset-0 z-20 bg-stone-900/40 md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        aria-hidden
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 md:static md:flex",
          mobileOpen ? "flex" : "hidden md:flex",
        )}
      >
        {aside}
      </div>
    </>
  );
}
