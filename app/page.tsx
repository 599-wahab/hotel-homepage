"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import BookingForm from "@/components/booking-form"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [zoomState, setZoomState] = useState<"default" | "facilities" | "booking">("default")
  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleFacilitiesClick = () => {
    setZoomState("facilities")
    // Reset after animation
    setTimeout(() => setZoomState("default"), 3000)
  }

  const handleBookRoomClick = () => {
    setZoomState("booking")
    // Reset after animation
    setTimeout(() => setZoomState("default"), 3000)
  }

  const getImageTransform = () => {
    switch (zoomState) {
      case "facilities":
        return {
          scale: 1.2,
          x: 200,
          y: -500,
        }
      case "booking":
        return {
          scale: 2.0,
          x: -1100,
          y: -200,
        }
      default:
        return {
          scale: 1,
          x: 0,
          y: 0,
        }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Image with Animation */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/placeholder.png?height=1080&width=1920')",
        }}
        animate={getImageTransform()}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 lg:p-6">
        <div className="text-2xl font-bold text-white">Marigold</div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
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

        <div className="hidden lg:block">
          <Button
            onClick={() => setShowBookingForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2"
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-sm z-20 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-yellow-300 transition-colors py-2">
                Home
              </Link>
              <Link href="/rooms" className="text-white hover:text-yellow-300 transition-colors py-2">
                Rooms
              </Link>
              <Link href="/facilities" className="text-white hover:text-yellow-300 transition-colors py-2">
                Facilities
              </Link>
              <Link href="/dining" className="text-white hover:text-yellow-300 transition-colors py-2">
                Dining
              </Link>
              <Link href="/services" className="text-white hover:text-yellow-300 transition-colors py-2">
                In-Room Services
              </Link>
              <Button
                onClick={() => setShowBookingForm(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white w-full mt-4"
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Welcome to <span className="text-yellow-400">Marigold</span> Hotel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-2xl mx-auto"
          >
            Experience luxury and comfort in the heart of the city. Your perfect stay awaits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => {
                handleBookRoomClick()
                setTimeout(() => setShowBookingForm(true), 2000)
              }}
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto"
              disabled={zoomState !== "default"}
            >
              Book Room
            </Button>
            <Button
              onClick={handleFacilitiesClick}
              size="lg"
              variant="outline"
              className="bg-yellow-900 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold w-full sm:w-auto"
              disabled={zoomState !== "default"}
            >
              See Facilities
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Zoom State Indicators */}
      <AnimatePresence>
        {zoomState === "facilities" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-center">Exploring Hotel Facilities...</p>
            </div>
          </motion.div>
        )}

        {zoomState === "booking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-center">Entering Guest Rooms...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>

      {/* Contact Section */}
      <section className="relative z-10 bg-black/80 backdrop-blur-sm py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 text-lg">Get in touch for reservations and inquiries</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center text-white"
            >
              <Phone className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-white"
            >
              <Mail className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-300">info@marigoldhotel.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-white"
            >
              <MapPin className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-gray-300">123 Luxury Ave, City Center</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-white"
            >
              <Clock className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="font-semibold mb-2">Reception</h3>
              <p className="text-gray-300">24/7 Available</p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Booking Form Modal */}
      <AnimatePresence>{showBookingForm && <BookingForm onClose={() => setShowBookingForm(false)} />}</AnimatePresence>
    </div>
  )
}
