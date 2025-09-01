// components/Footer.tsx
"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Footer() {
  const pathname = usePathname() ?? "/"
  const map: Record<string, string> = {
    "/": "/footer-home.jpg",
    "/rooms": "/footer-rooms.jpg",
    "/facilities": "/footer-facilities.jpg",
    "/dining": "/footer-dining.jpg",
    "/services": "/footer-services.jpg",
  }

  const findImage = () => {
    if (map[pathname]) return map[pathname]
    const match = Object.keys(map).find((k) => pathname.startsWith(k) && k !== "/")
    return map[match ?? "/"] ?? "/footer-default.jpg"
  }

  const footerImage = findImage()

  return (
    <footer className="w-full text-white mt-12">
      <div className="relative h-64 w-full">
        <Image src={footerImage} alt="footer" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="mb-2">
              <span className="text-white font-extrabold text-lg mr-1">Product by</span>
              <span className="text-yellow-400 font-extrabold text-lg">AWK</span>
              <span className="text-white text-xs align-super ml-1">MAN</span>
            </div>

            <nav className="flex gap-4 justify-center">
              <Link href="/" className="text-sm hover:text-yellow-300">Home</Link>
              <Link href="/rooms" className="text-sm hover:text-yellow-300">Rooms</Link>
              <Link href="/dining" className="text-sm hover:text-yellow-300">Dining</Link>
              <Link href="/contact" className="text-sm hover:text-yellow-300">Contact</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="bg-black/90 text-center py-3 text-sm text-gray-300">
        © {new Date().getFullYear()} Marigold Hotel — All rights reserved
      </div>
    </footer>
  )
}
