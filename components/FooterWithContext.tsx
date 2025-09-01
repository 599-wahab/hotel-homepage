// components/FooterWithContext.tsx
"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"
import { usePathname } from "next/navigation"
import { useFooter } from "./footer-context"

export default function FooterWithContext() {
  const pathname = usePathname() ?? "/"
  const { image } = useFooter()

  const map: Record<string, string> = {
    "/": "/footer-home.jpg",
    "/rooms": "/footer-rooms.jpg",
    "/facilities": "/footer-facilities.jpg",
    "/dining": "/footer-dining.jpg",
    "/services": "/footer-services.jpg",
  }

  const findMapped = () => {
    if (map[pathname]) return map[pathname]
    const match = Object.keys(map).find((k) => pathname.startsWith(k) && k !== "/")
    return map[match ?? "/"] ?? "/footer-default.jpg"
  }

  const footerImage = image ?? findMapped()

  return (
    <footer className="w-full text-white mt-12">
      <div className="relative w-full">
        {/* background image (next/image fill) */}
        <div className="relative h-64 w-full">
          <Image src={footerImage} alt="Footer background" fill className="object-cover" sizes="100vw" />
          {/* tasteful gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent" />
          {/* content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact */}
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

                {/* Quick Links */}
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

                {/* Newsletter + Social */}
                <div className="text-sm">
                  <h3 className="text-xl font-semibold">Stay in touch</h3>
                  <p className="mt-2 text-gray-200">Subscribe for exclusive offers & updates</p>

                  <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                      aria-label="Email"
                      type="email"
                      placeholder="you@email.com"
                      className="flex-1 px-3 py-2 rounded-md bg-black/40 placeholder-gray-300 text-white focus:outline-none"
                    />
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
          </div>
        </div>

        {/* bottom divider / copyright */}
        <div className="bg-black/90">
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
  )
}
