"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
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
          backgroundImage: "url('/marigol-1.png?height=1080&width=1920')",
        }}
        animate={getImageTransform()}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

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

      
      {/* Booking Form Modal */}
      <AnimatePresence>{showBookingForm && <BookingForm onClose={() => setShowBookingForm(false)} />}</AnimatePresence>
    </div>
  )
}
