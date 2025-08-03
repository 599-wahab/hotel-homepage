"use client"

import { useState } from "react"
import AdminLogin from "@/components/admin-login"
import { isAdminLoggedIn } from "@/lib/admin-auth"
import AdminDashboard from "@/components/admin-dashboard"
import RoomManagement from "@/components/room-management"
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn())

  return (
    <div className="relative min-h-screen bg-black text-yellow-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/marigold.png')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black z-0" />

      <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
          Marigold Admin Panel
        </h1>

        {!loggedIn ? (
          <div className="bg-black/70 backdrop-blur-md rounded-xl p-8 shadow-lg">
            <AdminLogin onSuccess={() => setLoggedIn(true)} />
          </div>
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  )
}
