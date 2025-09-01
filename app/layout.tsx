// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import NavWrapper from "@/components/nav-wrapper"
import { FooterProvider } from "@/components/footer-context"
import FooterWithContext from "@/components/FooterWithContext"

export const metadata: Metadata = {
  title: "MriGold Hotel",
  description: "Created with AWK",
  generator: "AWK Ltd",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">
        <FooterProvider>
          <NavWrapper />

          <main className="relative z-10">
            {children}
          </main>

          <FooterWithContext />
        </FooterProvider>
      </body>
    </html>
  )
}
