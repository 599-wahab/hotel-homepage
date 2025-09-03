// components/Nav.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavProps = {
  transparent?: boolean;
};

export default function Nav({ transparent = false }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={`${transparent ? "absolute top-0 left-0 right-0" : "relative"} z-40 w-full ${
        transparent ? "bg-transparent" : "bg-black/60 backdrop-blur-sm"
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Home">
            <div className="text-2xl font-extrabold text-white select-none">
              <span className="mr-1">Marigold</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link href="/rooms" className="text-white hover:text-yellow-300 transition-colors">
              Rooms
            </Link>
            <Link href="/facilities" className="text-white hover:text-yellow-300 transition-colors">
              Facilities
            </Link>
            <Link href="/dining" className="text-white hover:text-yellow-300 transition-colors">
              Dining
            </Link>
            <Link href="/services" className="text-white hover:text-yellow-300 transition-colors">
              In-Room Services
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Book Now</Button>
          </div>

          <button aria-label="Toggle menu" className="lg:hidden text-white" onClick={() => setIsOpen((v) => !v)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm z-40">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-white py-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/rooms" className="block text-white py-2" onClick={() => setIsOpen(false)}>
              Rooms
            </Link>
            <Link href="/facilities" className="block text-white py-2" onClick={() => setIsOpen(false)}>
              Facilities
            </Link>
            <Link href="/dining" className="block text-white py-2" onClick={() => setIsOpen(false)}>
              Dining
            </Link>
            <Link href="/services" className="block text-white py-2" onClick={() => setIsOpen(false)}>
              In-Room Services
            </Link>

            <div className="pt-3">
              <Button className="bg-yellow-600 w-full">Book Now</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
