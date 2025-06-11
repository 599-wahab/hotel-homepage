"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Wifi, Car, Dumbbell, Waves, Utensils, Users, Briefcase, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function FacilitiesPage() {
  const facilities = [
    {
      id: 1,
      name: "Swimming Pool",
      description: "Olympic-sized outdoor pool with poolside bar and lounge area",
      image: "/placeholder.svg?height=300&width=400",
      icon: Waves,
      features: ["Heated Pool", "Pool Bar", "Lounge Chairs", "Towel Service"],
    },
    {
      id: 2,
      name: "Fitness Center",
      description: "State-of-the-art gym with modern equipment and personal trainers",
      image: "/placeholder.svg?height=300&width=400",
      icon: Dumbbell,
      features: ["24/7 Access", "Personal Trainers", "Modern Equipment", "Group Classes"],
    },
    {
      id: 3,
      name: "Restaurant & Bar",
      description: "Fine dining restaurant with international cuisine and rooftop bar",
      image: "/placeholder.svg?height=300&width=400",
      icon: Utensils,
      features: ["Fine Dining", "Rooftop Bar", "Room Service", "Private Dining"],
    },
    {
      id: 4,
      name: "Conference Center",
      description: "Professional meeting rooms and event spaces for business gatherings",
      image: "/placeholder.svg?height=300&width=400",
      icon: Briefcase,
      features: ["Meeting Rooms", "AV Equipment", "Catering Service", "Business Center"],
    },
    {
      id: 5,
      name: "Spa & Wellness",
      description: "Full-service spa offering massages, treatments, and wellness programs",
      image: "/placeholder.svg?height=300&width=400",
      icon: Users,
      features: ["Massage Therapy", "Facial Treatments", "Sauna", "Wellness Programs"],
    },
    {
      id: 6,
      name: "Entertainment Lounge",
      description: "Gaming area with billiards, arcade games, and entertainment systems",
      image: "/placeholder.svg?height=300&width=400",
      icon: Gamepad2,
      features: ["Billiards", "Arcade Games", "Gaming Consoles", "Live Entertainment"],
    },
  ]

  const amenities = [
    { icon: Wifi, name: "Free WiFi", description: "High-speed internet throughout the hotel" },
    { icon: Car, name: "Valet Parking", description: "Complimentary valet parking service" },
    { icon: Users, name: "Concierge", description: "24/7 concierge service for all your needs" },
    { icon: Briefcase, name: "Business Center", description: "Fully equipped business facilities" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Facilities</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-yellow-600 to-yellow-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">World-Class Facilities</h2>
            <p className="text-xl">Experience luxury and comfort with our premium amenities</p>
          </motion.div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-600 p-2 rounded-full">
                    <facility.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{facility.name}</h3>
                  <p className="text-gray-600 mb-4">{facility.description}</p>
                  <div className="space-y-2">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Amenities */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Amenities</h2>
            <p className="text-gray-600 text-lg">Enjoy these complimentary services during your stay</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <amenity.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{amenity.name}</h3>
                <p className="text-gray-600 text-sm">{amenity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Reserve your table for an unforgettable dining experience at Marigold Hotel
            </p>
            <Link href="/rooms">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 text-lg">
                Book Your Stay
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
