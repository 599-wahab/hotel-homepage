// components/admin-dashboard.tsx
"use client";

import { useState } from "react";
import { logoutAdmin } from "@/lib/admin-auth";
import RoomManagement from "@/components/room-management";
import BookingManagement from "@/components/booking-management";
import {
  LayoutDashboard,
  Bed,
  ClipboardList,
  Wrench,
  DollarSign,
  LogOut,
  Users,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "room-management", label: "Room Mgmt", icon: Bed },
    { id: "rooms", label: "Rooms", icon: Users },
    { id: "bookings", label: "Bookings", icon: ClipboardList },
    { id: "services", label: "Services", icon: Settings },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "bills", label: "Bills", icon: DollarSign },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-yellow-600" size={28} />
          Admin Dashboard
        </h1>
        <button
          onClick={() => logoutAdmin()}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm transition ${
                selectedTab === tab.id
                  ? "bg-yellow-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        {selectedTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-yellow-50 p-5 rounded-xl shadow-sm border border-yellow-100">
              <h3 className="text-sm text-gray-600">Total Profit</h3>
              <p className="text-2xl font-bold text-yellow-700">$8,430</p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-xl shadow-sm border border-yellow-100">
              <h3 className="text-sm text-gray-600">Rooms Needing Maintenance</h3>
              <p className="text-2xl font-bold text-yellow-700">2</p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-xl shadow-sm border border-yellow-100">
              <h3 className="text-sm text-gray-600">Booked Rooms</h3>
              <p className="text-2xl font-bold text-yellow-700">14</p>
            </div>
          </div>
        )}

        {selectedTab === "room-management" && <RoomManagement />}

        {selectedTab === "rooms" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="p-3 bg-gray-50 rounded-lg">Room 101 - Deluxe - Available</li>
              <li className="p-3 bg-gray-50 rounded-lg">Room 102 - Standard - Booked</li>
              <li className="p-3 bg-gray-50 rounded-lg">Room 103 - Suite - Needs Maintenance</li>
            </ul>
          </div>
        )}

        {selectedTab === "bookings" && <BookingManagement />}

        {selectedTab === "services" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Requested Services</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="p-3 bg-gray-50 rounded-lg">Room 104 - Spa</li>
              <li className="p-3 bg-gray-50 rounded-lg">Room 105 - Room Cleaning</li>
            </ul>
          </div>
        )}

        {selectedTab === "maintenance" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Rooms Needing Maintenance</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="p-3 bg-gray-50 rounded-lg">Room 103 - AC issue</li>
              <li className="p-3 bg-gray-50 rounded-lg">Room 108 - Plumbing</li>
            </ul>
          </div>
        )}

        {selectedTab === "bills" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Add Maintenance Bills</h2>
            <form className="space-y-4 max-w-sm">
              <input
                type="text"
                placeholder="Room Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="Issue"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="number"
                placeholder="Amount ($)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition">
                Submit Bill
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
