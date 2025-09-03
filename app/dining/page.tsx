"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function DiningPage() {
  const [activeCategory, setActiveCategory] = useState("appetizers")

  const categories = [
    { id: "appetizers", name: "Appetizers" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
  ]

  const menuItems = {
    appetizers: [
      {
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle and parmesan",
        price: "PKR 18",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Seared Scallops",
        description: "Pan-seared scallops with cauliflower puree and pancetta",
        price: "PKR 24",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Burrata Caprese",
        description: "Fresh burrata with heirloom tomatoes and basil oil",
        price: "PKR 16",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    mains: [
      {
        name: "Wagyu Beef Tenderloin",
        description: "Grilled wagyu with roasted vegetables and red wine jus",
        price: "PKR 65",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Pan-Seared Salmon",
        description: "Atlantic salmon with quinoa pilaf and lemon butter sauce",
        price: "PKR 38",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Duck Confit",
        description: "Slow-cooked duck leg with cherry gastrique and potato gratin",
        price: "PKR 42",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Lobster Risotto",
        description: "Creamy arborio rice with fresh lobster and saffron",
        price: "PKR 48",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    desserts: [
      {
        name: "Chocolate Soufflé",
        description: "Warm chocolate soufflé with vanilla ice cream",
        price: "PKR 14",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Tiramisu",
        description: "Classic Italian tiramisu with espresso and mascarpone",
        price: "PKR 12",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Crème Brûlée",
        description: "Vanilla custard with caramelized sugar and fresh berries",
        price: "PKR 13",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    beverages: [
      {
        name: "Wine Selection",
        description: "Curated selection of international wines",
        price: "PKR 12-85",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Craft Cocktails",
        description: "Signature cocktails crafted by our mixologists",
        price: "PKR 15-22",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        name: "Premium Coffee",
        description: "Freshly roasted coffee and espresso drinks",
        price: "PKR 5-8",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  }

  const restaurants = [
    {
      name: "The Golden Dining Room",
      description: "Fine dining restaurant featuring international cuisine",
      hours: "6:00 PM - 11:00 PM",
      location: "2nd Floor",
      phone: "+1 (555) 123-4567",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      name: "Rooftop Bar & Grill",
      description: "Casual dining with panoramic city views",
      hours: "5:00 PM - 1:00 AM",
      location: "Rooftop",
      phone: "+1 (555) 123-4568",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      name: "Lobby Café",
      description: "Light meals, coffee, and pastries",
      hours: "6:00 AM - 10:00 PM",
      location: "Main Lobby",
      phone: "+1 (555) 123-4569",
      image: "/placeholder.svg?height=250&width=400",
    },
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
            <h1 className="text-3xl font-bold text-gray-900">Dining Experience</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Marigold Hotel Dining</h2>
            <p className="text-xl">Savor exceptional flavors crafted by world-class chefs</p>
          </motion.div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Restaurants</h2>
          <p className="text-gray-600 text-lg">Discover our diverse dining venues</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Menu Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Menu</h2>
          <p className="text-gray-600 text-lg">Sample our signature dishes</p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={activeCategory === category.id ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {menuItems[activeCategory as keyof typeof menuItems].map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className="text-yellow-600 font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Reservation CTA */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold text-white mb-4">Make a Reservation</h2>
            <p className="text-gray-300 text-lg mb-8">Reserve your table for an unforgettable dining experience</p>
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 text-lg">
              Book a Table
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
