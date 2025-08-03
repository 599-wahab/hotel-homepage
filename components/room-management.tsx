// components/room-management.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logoutAdmin } from "@/lib/admin-auth"

interface Room {
  id: string
  number: string
  type: string
  status: "available" | "occupied" | "maintenance"
  capacity: number
  price: number
  description: string
}

interface RoomHistory {
  id: string
  roomId: string
  guestName: string
  guestContact: string
  checkIn: string
  checkOut: string
  createdAt: string
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomHistory, setRoomHistory] = useState<RoomHistory[]>([])
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem("rooms")
    const savedHistory = localStorage.getItem("roomHistory")
    
    if (savedRooms) setRooms(JSON.parse(savedRooms))
    if (savedHistory) setRoomHistory(JSON.parse(savedHistory))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms))
  }, [rooms])

  useEffect(() => {
    localStorage.setItem("roomHistory", JSON.stringify(roomHistory))
  }, [roomHistory])

  const handleAddRoom = () => {
    setCurrentRoom(null)
    setShowForm(true)
  }

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room)
    setShowForm(true)
  }

  const handleViewHistory = (roomId: string) => {
    setShowHistory(true)
  }

  const handleSaveRoom = (roomData: Room) => {
    if (currentRoom) {
      // Update existing room
      setRooms(rooms.map(r => r.id === roomData.id ? roomData : r))
    } else {
      // Add new room
      const newRoom = { ...roomData, id: Date.now().toString() }
      setRooms([...rooms, newRoom])
    }
    setShowForm(false)
  }

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id))
    // Also remove history for deleted room
    setRoomHistory(roomHistory.filter(history => history.roomId !== id))
  }

  const handleAddHistory = (history: RoomHistory) => {
    // Keep only the last 20 history records for this room
    const filteredHistory = [
      history,
      ...roomHistory.filter(h => h.roomId === history.roomId).slice(0, 19)
    ]
    
    setRoomHistory([
      ...roomHistory.filter(h => h.roomId !== history.roomId),
      ...filteredHistory
    ])
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddRoom}>Add New Room</Button>
          <Button variant="outline" onClick={() => logoutAdmin()}>
            Logout
          </Button>
        </div>
      </div>

      {showForm ? (
        <RoomForm 
          room={currentRoom} 
          onSave={handleSaveRoom} 
          onCancel={() => setShowForm(false)}
          onAddHistory={handleAddHistory}
        />
      ) : showHistory ? (
        <RoomHistoryView 
          history={roomHistory.filter(h => h.roomId === currentRoom?.id)}
          onBack={() => {
            setShowHistory(false)
            setShowForm(true)
          }}
        />
      ) : (
        <RoomList 
          rooms={rooms} 
          onEdit={handleEditRoom} 
          onDelete={handleDeleteRoom}
          onViewHistory={handleViewHistory}
        />
      )}
    </div>
  )
}

function RoomList({ rooms, onEdit, onDelete, onViewHistory }: { 
  rooms: Room[], 
  onEdit: (room: Room) => void, 
  onDelete: (id: string) => void,
  onViewHistory: (roomId: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        {rooms.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No rooms found. Add your first room.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.number}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>
                    <Badge variant={
                      room.status === "available" ? "default" : 
                      room.status === "occupied" ? "secondary" : "destructive"
                    }>
                      {room.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>${room.price}/night</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => onEdit(room)}>Edit</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onViewHistory(room.id)}
                    >
                      History
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => onDelete(room.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function RoomForm({ room, onSave, onCancel, onAddHistory }: { 
  room: Room | null, 
  onSave: (room: Room) => void, 
  onCancel: () => void,
  onAddHistory: (history: RoomHistory) => void
}) {
  const [formData, setFormData] = useState<Room>(room || {
    id: "",
    number: "",
    type: "standard",
    status: "available",
    capacity: 2,
    price: 150,
    description: ""
  })

  const [historyForm, setHistoryForm] = useState({
    guestName: "",
    guestContact: "",
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleNumberChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: Number(value) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleAddHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddHistory({
      id: Date.now().toString(),
      roomId: formData.id,
      guestName: historyForm.guestName,
      guestContact: historyForm.guestContact,
      checkIn: historyForm.checkIn,
      checkOut: historyForm.checkOut,
      createdAt: new Date().toISOString()
    })
    setHistoryForm({
      guestName: "",
      guestContact: "",
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date().toISOString().split('T')[0]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{room ? "Edit Room" : "Add New Room"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Room Number *</Label>
                <Input 
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label>Room Type *</Label>
                <Select 
                  value={formData.type}
                  onValueChange={value => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Status *</Label>
                <Select 
                  value={formData.status}
                  onValueChange={value => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Capacity *</Label>
                <Input 
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={(e) => handleNumberChange("capacity", e.target.value)}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <Label>Price per night ($) *</Label>
                <Input 
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => handleNumberChange("price", e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Room features, amenities, etc."
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {room ? "Update Room" : "Add Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {formData.id && (
        <Card>
          <CardHeader>
            <CardTitle>Add Previous Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHistorySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Guest Name *</Label>
                  <Input 
                    value={historyForm.guestName}
                    onChange={(e) => setHistoryForm({...historyForm, guestName: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label>Contact Info *</Label>
                  <Input 
                    value={historyForm.guestContact}
                    onChange={(e) => setHistoryForm({...historyForm, guestContact: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label>Check-in Date</Label>
                  <Input 
                    type="date"
                    value={historyForm.checkIn}
                    onChange={(e) => setHistoryForm({...historyForm, checkIn: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Check-out Date</Label>
                  <Input 
                    type="date"
                    value={historyForm.checkOut}
                    onChange={(e) => setHistoryForm({...historyForm, checkOut: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" variant="secondary">
                  Add to History
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

function RoomHistoryView({ history, onBack }: { 
  history: RoomHistory[], 
  onBack: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Room History</CardTitle>
            <Button variant="outline" onClick={onBack}>
              Back to Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No history found for this room.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Recorded At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.guestName}</TableCell>
                    <TableCell>{record.guestContact}</TableCell>
                    <TableCell>{new Date(record.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(record.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}