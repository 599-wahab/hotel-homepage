// components/nav-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";

export default function NavWrapper() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  return <Nav transparent={isHome} />;
}
