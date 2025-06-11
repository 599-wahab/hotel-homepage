"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, Utensils, Shirt, Car, Baby, Wifi, Phone } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: "24/7 Room Service",
      description: "Enjoy delicious meals delivered to your room at any time",
      icon: Utensils,
      features: ["24/7 Availability", "Full Menu", "Express Service", "Special Dietary Options"],
      price: "Menu Prices Apply",
    },
    {
      id: 2,
      name: "Laundry & Dry Cleaning",
      description: "Professional laundry and dry cleaning services",
      icon: Shirt,
      features: ["Same Day Service", "Dry Cleaning", "Pressing", "Shoe Shine"],
      price: "From $15",
    },
    {
      id: 3,
      name: "Valet Parking",
      description: "Convenient valet parking service for all guests",
      icon: Car,
      features: ["24/7 Valet", "Secure Parking", "Car Wash Available", "Airport Transfer"],
      price: "Complimentary",
    },
    {
      id: 4,
      name: "Babysitting Service",
      description: "Professional childcare services for your peace of mind",
      icon: Baby,
      features: ["Licensed Caregivers", "Flexible Hours", "Activities Included", "Emergency Contact"],
      price: "$25/hour",
    },
    {
      id: 5,
      name: "High-Speed Internet",
      description: "Complimentary high-speed WiFi throughout the hotel",
      icon: Wifi,
      features: ["Free WiFi", "High Speed", "Business Center", "Printing Services"],
      price: "Complimentary",
    },
    {
      id: 6,
      name: "Concierge Service",
      description: "Personal assistance for reservations, tours, and recommendations",
      icon: Phone,
      features: ["24/7 Assistance", "Tour Booking", "Restaurant Reservations", "Local Recommendations"],
      price: "Complimentary",
    },
  ]

  const additionalServices = [
    "Airport Transportation",
    "Currency Exchange",
    "Medical Services",
    "Pet Care Services",
    "Event Planning",
    "Personal Shopping",
    "Massage Therapy",
    "Flower Delivery",
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
            <h1 className="text-3xl font-bold text-gray-900">In-Room Services</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Marigold Hotel Services</h2>
            <p className="text-xl">Personalized services designed for your comfort and convenience</p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <service.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-blue-600 font-semibold">{service.price}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-800">Features:</h4>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Request Service</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-gray-600 text-lg">More ways we can make your stay exceptional</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="text-gray-800 font-medium">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Hours */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Service Hours</h2>
            <div className="grid md:grid-cols-2 gap-8 text-white">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2" />
                  24/7 Services
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Room Service</li>
                  <li>Concierge</li>
                  <li>Valet Parking</li>
                  <li>Security</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Business Hours
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Laundry Service: 7 AM - 10 PM</li>
                  <li>Babysitting: 8 AM - 11 PM</li>
                  <li>Business Center: 6 AM - 12 AM</li>
                  <li>Spa Services: 9 AM - 9 PM</li>
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                Contact Concierge
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
