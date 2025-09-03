// components/FooterWithContext.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";
import { useFooter } from "./footer-context";

export default function FooterWithContext() {
  const pathname = usePathname() ?? "/";
  const { image } = useFooter();

  const map: Record<string, string> = {
    "/": "/footer-home.jpg",
    "/rooms": "/footer-rooms.jpg",
    "/facilities": "/footer-facilities.jpg",
    "/dining": "/footer-dining.jpg",
    "/services": "/footer-services.jpg",
  };

  const findMapped = () => {
    if (map[pathname]) return map[pathname];
    const match = Object.keys(map).find((k) => pathname.startsWith(k) && k !== "/");
    return map[match ?? "/"] ?? "/footer-default.jpg";
  };

  const footerImage = image ?? findMapped();

  return (
    <footer className="w-full text-white bg-transparent relative z-10">
      {/* background image (absolute) */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
        </div>

        {/* CONTENT: in normal flow so it can grow on small screens */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-sm">
              <h3 className="text-xl font-semibold">Contact</h3>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span>123 Luxury Ave, City Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-yellow-400" />
                <a className="hover:text-yellow-300" href="tel:+15551234567">+1 (555) 123-4567</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <a className="hover:text-yellow-300" href="mailto:info@marigoldhotel.com">info@marigoldhotel.com</a>
              </div>
            </div>

            <div className="text-sm">
              <h3 className="text-xl font-semibold">Explore</h3>
              <ul className="mt-3 space-y-2">
                <li><Link href="/" className="hover:text-yellow-300">Home</Link></li>
                <li><Link href="/rooms" className="hover:text-yellow-300">Rooms</Link></li>
                <li><Link href="/facilities" className="hover:text-yellow-300">Facilities</Link></li>
                <li><Link href="/dining" className="hover:text-yellow-300">Dining</Link></li>
                <li><Link href="/services" className="hover:text-yellow-300">Services</Link></li>
              </ul>
            </div>

            <div className="text-sm">
              <h3 className="text-xl font-semibold">Stay in touch</h3>
              <p className="mt-2 text-gray-200">Subscribe for exclusive offers & updates</p>

              <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input aria-label="Email" type="email" placeholder="you@email.com"
                  className="flex-1 px-3 py-2 rounded-md bg-black/40 placeholder-gray-300 text-white focus:outline-none" />
                <button className="px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-black font-medium">
                  Subscribe
                </button>
              </form>

              <div className="mt-4 flex items-center gap-3">
                <a className="p-2 rounded-full bg-white/10 hover:bg-white/20" href="#" aria-label="Facebook">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a className="p-2 rounded-full bg-white/10 hover:bg-white/20" href="#" aria-label="Instagram">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a className="p-2 rounded-full bg-white/10 hover:bg-white/20" href="#" aria-label="Twitter">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* bottom divider / copyright (normal flow) */}
        <div className="bg-black/95">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">
            <div>© {new Date().getFullYear()} Marigold Hotel — All rights reserved</div>
            <div className="mt-2 md:mt-0">
              <span className="mr-4 font-semibold text-white">Product by <span className="text-yellow-400">AWK</span><span className="align-super text-xs ml-1">MAN</span></span>
              <span className="mx-2">•</span>
              <Link href="/privacy" className="hover:text-yellow-300">Privacy</Link>
              <span className="mx-2">•</span>
              <Link href="/terms" className="hover:text-yellow-300">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
