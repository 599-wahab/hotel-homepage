"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Bed, Wifi, Car, Coffee, Tv, Bath } from "lucide-react"
import Link from "next/link"
import BookingForm from "@/components/booking-form"

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const rooms = [
    {
      id: 1,
      name: "Standard Room",
      price: "PKR 150",
      image: "/placeholder.svg?height=400&width=600",
      capacity: "2 Guests",
      bed: "Queen Bed",
      size: "25 m²",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar"],
      description: "Comfortable and well-appointed room perfect for couples or business travelers.",
      features: [
        { icon: Users, text: "2 Guests" },
        { icon: Bed, text: "Queen Bed" },
        { icon: Wifi, text: "Free WiFi" },
        { icon: Tv, text: "Smart TV" },
      ],
    },
    {
      id: 2,
      name: "Deluxe Room",
      price: "PKR 220",
      image: "/placeholder.svg?height=400&width=600",
      capacity: "3 Guests",
      bed: "King Bed",
      size: "35 m²",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony", "Room Service"],
      description: "Spacious room with modern amenities and a beautiful city view.",
      features: [
        { icon: Users, text: "3 Guests" },
        { icon: Bed, text: "King Bed" },
        { icon: Wifi, text: "Free WiFi" },
        { icon: Coffee, text: "Coffee Maker" },
      ],
    },
    {
      id: 3,
      name: "Executive Suite",
      price: "PKR 350",
      image: "/placeholder.svg?height=400&width=600",
      capacity: "4 Guests",
      bed: "King Bed + Sofa",
      size: "55 m²",
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony", "Room Service", "Jacuzzi"],
      description: "Luxurious suite with separate living area and premium amenities.",
      features: [
        { icon: Users, text: "4 Guests" },
        { icon: Bed, text: "King Bed + Sofa" },
        { icon: Bath, text: "Jacuzzi" },
        { icon: Car, text: "Valet Parking" },
      ],
    },
    {
      id: 4,
      name: "Presidential Suite",
      price: "PKR 500",
      image: "/placeholder.svg?height=400&width=600",
      capacity: "6 Guests",
      bed: "King Bed + 2 Singles",
      size: "85 m²",
      amenities: [
        "Free WiFi",
        "Air Conditioning",
        "TV",
        "Mini Bar",
        "Balcony",
        "Room Service",
        "Jacuzzi",
        "Butler Service",
      ],
      description: "The ultimate luxury experience with panoramic views and exclusive services.",
      features: [
        { icon: Users, text: "6 Guests" },
        { icon: Bed, text: "Multiple Beds" },
        { icon: Bath, text: "Spa Bathroom" },
        { icon: Car, text: "Complimentary Valet" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Marigold Hotel Rooms</h1>
            </div>
            <Button onClick={() => setShowBookingForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 right-4 bg-yellow-600 text-white px-3 py-1 rounded-full font-semibold">
                    {room.price}/night
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {room.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <feature.icon className="w-4 h-4" />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      {selectedRoom === room.id ? "Hide Details" : "View Details"}
                    </Button>
                    <Button
                      onClick={() => setShowBookingForm(true)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    >
                      Book Room
                    </Button>
                  </div>

                  <AnimatePresence>
                    {selectedRoom === room.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="font-semibold text-yellow-600">{room.capacity}</div>
                            <div className="text-sm text-gray-600">Capacity</div>
                          </div>
                          <div>
                            <div className="font-semibold text-yellow-600">{room.bed}</div>
                            <div className="text-sm text-gray-600">Bed Type</div>
                          </div>
                          <div>
                            <div className="font-semibold text-yellow-600">{room.size}</div>
                            <div className="text-sm text-gray-600">Room Size</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>{showBookingForm && <BookingForm onClose={() => setShowBookingForm(false)} />}</AnimatePresence>
    </div>
  )
}
