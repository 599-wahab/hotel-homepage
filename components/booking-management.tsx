// components/booking-management.tsx
'use client'

import { useState } from 'react'
import { Calendar, User, Bed, Plus, X, Search } from 'lucide-react'

export default function BookingManagement() {
  const [bookings, setBookings] = useState([
    { id: 1, guest: "Ali Khan", room: "Deluxe Suite", date: "2025-08-12", status: "confirmed" },
    { id: 2, guest: "Sara Ahmed", room: "Standard Room", date: "2025-08-14", status: "pending" },
    { id: 3, guest: "John Smith", room: "Executive Suite", date: "2025-08-15", status: "confirmed" },
    { id: 4, guest: "Emma Johnson", room: "Presidential Suite", date: "2025-08-17", status: "cancelled" },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newBooking, setNewBooking] = useState({ 
    guest: "", 
    room: "", 
    date: "",
    status: "confirmed"
  })
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBooking.guest || !newBooking.room || !newBooking.date) return

    setBookings([
      ...bookings,
      { id: Date.now(), ...newBooking }
    ])
    setNewBooking({ guest: "", room: "", date: "", status: "confirmed" })
    setShowForm(false)
  }

  const filteredBookings = bookings.filter(booking => 
    booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.room.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-gray-600">Manage all hotel reservations and bookings</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            <Plus size={18} />
            Add Booking
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <User className="text-yellow-600" size={18} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.guest}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Bed className="text-gray-500 mr-2" size={16} />
                      {booking.room}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="text-gray-500 mr-2" size={16} />
                      {booking.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-yellow-600 hover:text-yellow-800 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Booking</h2>
              <button 
                onClick={() => setShowForm(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={newBooking.guest}
                  onChange={(e) => setNewBooking({ ...newBooking, guest: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={newBooking.room}
                  onChange={(e) => setNewBooking({ ...newBooking, room: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select room type</option>
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newBooking.status}
                  onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as any })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition"
              >
                Save Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}