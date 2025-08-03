// components/admin-dashboard.tsx
"use client"

import { useState } from "react"
import { logoutAdmin } from "@/lib/admin-auth"
import RoomManagement from "@/components/room-management"

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const tabs = [
    "overview",
    "room-management",
    "rooms",
    "bookings",
    "services",
    "maintenance",
    "bills",
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={() => logoutAdmin()} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`capitalize px-4 py-2 rounded ${
              selectedTab === tab ? "bg-yellow-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === "overview" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p>Total profit this month: <strong>$8,430</strong></p>
            <p>Rooms needing maintenance: <strong>2</strong></p>
            <p>Booked Rooms: <strong>14</strong></p>
          </div>
        )}

        {selectedTab === "room-management" && <RoomManagement />}

        {selectedTab === "rooms" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Available Rooms</h2>
            <ul className="space-y-2">
              <li>Room 101 - Deluxe - Available</li>
              <li>Room 102 - Standard - Booked</li>
              <li>Room 103 - Suite - Needs Maintenance</li>
            </ul>
          </div>
        )}

        {selectedTab === "bookings" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Bookings</h2>
            <ul>
              <li>John Doe - Room 102 - 3 Nights</li>
              <li>Mary Smith - Room 104 - 2 Nights</li>
            </ul>
          </div>
        )}

        {selectedTab === "services" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Requested Services</h2>
            <ul>
              <li>Room 104 - Spa</li>
              <li>Room 105 - Room Cleaning</li>
            </ul>
          </div>
        )}

        {selectedTab === "maintenance" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Rooms Needing Maintenance</h2>
            <ul>
              <li>Room 103 - AC issue</li>
              <li>Room 108 - Plumbing</li>
            </ul>
          </div>
        )}

        {selectedTab === "bills" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Add Maintenance Bills</h2>
            <form className="space-y-4 max-w-sm">
              <input type="text" placeholder="Room Number" className="w-full p-2 border" />
              <input type="text" placeholder="Issue" className="w-full p-2 border" />
              <input type="number" placeholder="Amount ($)" className="w-full p-2 border" />
              <button className="bg-yellow-600 text-white px-4 py-2">Submit Bill</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
