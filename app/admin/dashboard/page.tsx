// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { logoutAdmin, isAdminLoggedIn } from '@/lib/admin-auth'
import { Calendar, Bed, Utensils, ConciergeBell, Info, User, Settings, LogOut } from 'lucide-react'
import RoomManagement from '@/components/room-management'
import BookingManagement from '@/components/booking-management'
import ServiceManagement from '@/components/service-management'

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!isAdminLoggedIn()) {
      window.location.href = '/admin/login'
    }
  }, [])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <Bed size={18} /> },
    { id: 'rooms', name: 'Room Management', icon: <Bed size={18} /> },
    { id: 'bookings', name: 'Bookings', icon: <Calendar size={18} /> },
    { id: 'dining', name: 'Dining', icon: <Utensils size={18} /> },
    { id: 'facilities', name: 'Facilities', icon: <ConciergeBell size={18} /> },
    { id: 'services', name: 'Services', icon: <Info size={18} /> },
    { id: 'maintenance', name: 'Maintenance', icon: <Settings size={18} /> },
    { id: 'bills', name: 'Billing', icon: <Info size={18} /> },
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
  ]

  if (!isClient) return null

  const handleLogout = () => {
    logoutAdmin()
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-yellow-700 to-yellow-800 text-white shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="bg-yellow-500 p-1 rounded-lg">
              <Bed size={24} />
            </div>
            Marigold Hotel
          </h1>
          <p className="text-yellow-200 text-sm mt-1">Admin Dashboard</p>
        </div>

        <nav className="mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center w-full px-6 py-3 text-left transition-all ${
                selectedTab === tab.id
                  ? 'bg-yellow-600/90 border-l-4 border-yellow-300'
                  : 'hover:bg-yellow-600/50'
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
          
          <button
            className="flex items-center w-full px-6 py-3 text-left mt-4 hover:bg-yellow-600/50 transition-all"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {tabs.find(t => t.id === selectedTab)?.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {selectedTab === 'dashboard' && <DashboardOverview />}
          {selectedTab === 'rooms' && <RoomManagement />}
          {selectedTab === 'bookings' && <BookingManagement />}
          {selectedTab === 'services' && <ServiceManagement />}
          {selectedTab === 'dining' && <DiningManagement />}
          {selectedTab === 'facilities' && <FacilitiesManagement />}
          {selectedTab === 'maintenance' && <MaintenanceManagement />}
          {selectedTab === 'bills' && <BillingManagement />}
          {selectedTab === 'profile' && <ProfileManagement />}
        </main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  const stats = [
    { label: 'Total Bookings', value: '142', icon: <Calendar className="text-yellow-500" size={24} /> },
    { label: 'Occupancy Rate', value: '78%', icon: <Bed className="text-yellow-500" size={24} /> },
    { label: 'Revenue', value: '$42,380', icon: <ConciergeBell className="text-yellow-500" size={24} /> },
    { label: 'Pending Requests', value: '12', icon: <Info className="text-yellow-500" size={24} /> },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">Deluxe Suite</td>
                    <td className="px-6 py-4 whitespace-nowrap">2023-06-1{i+2}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Room Occupancy</h3>
          <div className="h-64 flex items-end space-x-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t"
                  style={{ height: `${30 + Math.random() * 70}%` }}
                />
                <span className="text-xs mt-2 text-gray-500">Room {i+101}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DiningManagement() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Dining Management</h2>
      {/* Dining content */}
    </div>
  )
}

function FacilitiesManagement() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Facilities Management</h2>
      {/* Facilities content */}
    </div>
  )
}

function MaintenanceManagement() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Maintenance Management</h2>
      {/* Maintenance content */}
    </div>
  )
}

function BillingManagement() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Billing Management</h2>
      {/* Billing content */}
    </div>
  )
}

function ProfileManagement() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Admin Profile</h2>
      {/* Profile content */}
    </div>
  )
}