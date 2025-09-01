// components/nav-wrapper.tsx
"use client"

import { usePathname } from "next/navigation"
import Nav from "./Nav"

export default function NavWrapper() {
  const pathname = usePathname() ?? "/"
  // Make nav transparent only on the root/home path
  const isHome = pathname === "/"
  return <Nav transparent={isHome} />
}
