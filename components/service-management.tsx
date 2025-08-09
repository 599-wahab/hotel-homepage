// components/service-management.tsx
'use client'

import { useState } from 'react'
import { ConciergeBell, Plus, X, Check, Clock, User } from 'lucide-react'

export default function ServiceManagement() {
  const [services, setServices] = useState([
    { id: 1, room: '101', type: 'Room Cleaning', status: 'completed', time: '2023-06-15 09:30' },
    { id: 2, room: '205', type: 'Spa Appointment', status: 'pending', time: '2023-06-15 14:00' },
    { id: 3, room: '312', type: 'Food Delivery', status: 'in-progress', time: '2023-06-15 12:45' },
    { id: 4, room: '107', type: 'Extra Towels', status: 'pending', time: '2023-06-15 10:15' },
  ])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <Check size={16} className="mr-1" />;
      case 'pending': return <Clock size={16} className="mr-1" />;
      case 'in-progress': return <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mr-1" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-500 mr-1" />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-gray-600">Manage guest service requests and amenities</p>
        </div>
        
        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition">
          <Plus size={18} />
          New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Requests</p>
              <p className="text-2xl font-bold mt-1">42</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ConciergeBell className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold mt-1">12</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold mt-1">22</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="text-green-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium">{service.room}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      <span className="flex items-center">
                        {getStatusIcon(service.status)}
                        {service.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-yellow-600 hover:text-yellow-800 mr-3">Update</button>
                    <button className="text-red-600 hover:text-red-800">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}