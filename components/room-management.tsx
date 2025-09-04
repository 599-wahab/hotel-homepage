// components/room-management.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Room {
  id: string;
  number: string;
  type: string;
  status: "available" | "occupied" | "maintenance";
  capacity: number;
  price: number;
  description: string;
}

interface RoomHistory {
  id: string;
  roomId: string;
  guestName: string;
  guestContact: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
}

interface RoomType {
  id: string;
  name: string;
  price_per_night: number;
  price_per_hour: number;
  currency: string;
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomHistory, setRoomHistory] = useState<RoomHistory[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  (async () => {
    setLoading(true); // Start loader when fetching
    try {
      const [rRes, tRes] = await Promise.all([
        fetch("/api/rooms"),
        fetch("/api/room-types"),
      ]);

      const roomsData = await rRes.json();
      const typesData = await tRes.json();

      if (roomsData?.ok) setRooms(roomsData.rooms || []);
      else if (Array.isArray(roomsData)) setRooms(roomsData);

      if (typesData?.ok) setRoomTypes(typesData.room_types || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Stop loader after fetch
    }
  })();
}, []);

  const refreshTypes = async () => {
    try {
      const res = await fetch("/api/room-types");
      const data = await res.json();
      if (data?.ok) setRoomTypes(data.room_types || []);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshRooms = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/rooms");
    const data = await res.json();
    if (data?.ok) setRooms(data.rooms || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleAddRoom = () => {
    setCurrentRoom(null);
    setShowForm(true);
  };

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room);
    setShowForm(true);
  };

  const handleViewHistory = async (roomId: string) => {
    setShowHistory(true);
    setCurrentRoom(rooms.find((r) => r.id === roomId) || null);

    try {
      const res = await fetch(`/api/bookings?roomId=${roomId}`);
      const data = await res.json();
      if (data.ok) setRoomHistory(data.bookings || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async (roomData: Room) => {
    try {
      if (roomData.id) {
        const res = await fetch(`/api/rooms/${roomData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        const data = await res.json();
        if (res.ok) {
          await refreshRooms();
          setShowForm(false);
        } else {
          alert(data.error || "Update failed");
        }
      } else {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        });
        const data = await res.json();
        if (res.ok) {
          await refreshRooms();
          setShowForm(false);
        } else {
          alert(data.error || "Create failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.id !== id));
        setRoomHistory((prev) => prev.filter((h) => h.roomId !== id));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [typeForm, setTypeForm] = useState({
    name: "",
    price_per_night: "",
    price_per_hour: "",
  });

  const createRoomType = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typeForm.name) return alert("Name required");
    try {
      const res = await fetch("/api/room-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: typeForm.name,
          price_per_night: Number(typeForm.price_per_night || 0),
          price_per_hour: Number(typeForm.price_per_hour || 0),
          currency: "PKR",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTypeForm({ name: "", price_per_night: "", price_per_hour: "" });
        await refreshTypes();
      } else {
        alert(data.error || "Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRoomType = async (id: string) => {
    if (!confirm("Delete this room type?")) return;
    try {
      const res = await fetch(`/api/room-types?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        await refreshTypes();
      } else {
        alert(data.error || "Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddRoom} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Add New Room
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowTypeManager((s) => !s);
            }}
            className="border-white/30 text-white bg-white/10"
          >
            Room Types
          </Button>
        </div>
      </div>

      {/* ROOM TYPES */}
      {showTypeManager && (
        <Card className="bg-white/6 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Room Types</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createRoomType} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <Input
                placeholder="Type name (e.g. Deluxe)"
                value={typeForm.name}
                onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                className="bg-white/10 text-white"
              />
              <Input
                placeholder="Price / night (PKR)"
                value={typeForm.price_per_night}
                onChange={(e) => setTypeForm({ ...typeForm, price_per_night: e.target.value })}
                className="bg-white/10 text-white"
                type="number"
              />
              <Input
                placeholder="Price / hour (PKR)"
                value={typeForm.price_per_hour}
                onChange={(e) => setTypeForm({ ...typeForm, price_per_hour: e.target.value })}
                className="bg-white/10 text-white"
                type="number"
              />
              <div className="sm:col-span-3 flex gap-2">
                <Button type="submit" className="bg-yellow-500">Create Type</Button>
                <Button variant="outline" onClick={() => setShowTypeManager(false)} className="text-white bg-white/10">Close</Button>
              </div>
            </form>

            {/* TABLE + CARDS RESPONSIVE */}
            <div className="hidden md:block bg-white/6 rounded-xl border border-white/10 shadow-sm overflow-hidden backdrop-blur-md">
              {loading ? (
                <div className="p-6 flex justify-center items-center">
                  <Loader2 className="animate-spin text-yellow-500" size={28} />
                </div>
              ) : (
                <div className="overflow-x-auto hidden sm:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left text-white/70 px-2 py-1">Name</th>
                        <th className="text-left text-white/70 px-2 py-1">Price/night (PKR)</th>
                        <th className="text-left text-white/70 px-2 py-1">Price/hour (PKR)</th>
                        <th className="text-left text-white/70 px-2 py-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomTypes.map((t) => (
                        <tr key={t.id} className="bg-white/5 text-white">
                          <td className="px-2 py-1">{t.name}</td>
                          <td className="px-2 py-1">PKR {Number(t.price_per_night || 0).toLocaleString()}</td>
                          <td className="px-2 py-1">PKR {Number(t.price_per_hour || 0).toLocaleString()}</td>
                          <td className="px-2 py-1">
                            <Button size="sm" variant="outline" className="bg-white/5 text-white" onClick={() => deleteRoomType(t.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* MOBILE CARDS */}
            <div className="sm:hidden space-y-3">
              {roomTypes.map((t) => (
                <Card key={t.id} className="bg-white/5 border border-white/20">
                  <CardContent className="p-3 text-white text-sm space-y-1">
                    <p><strong>Name:</strong> {t.name}</p>
                    <p><strong>Price/night:</strong> PKR {Number(t.price_per_night || 0).toLocaleString()}</p>
                    <p><strong>Price/hour:</strong> PKR {Number(t.price_per_hour || 0).toLocaleString()}</p>
                    <Button size="sm" variant="outline" className="bg-red-500/20 text-red-300 mt-2" onClick={() => deleteRoomType(t.id)}>Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MAIN LIST */}
      {showForm ? (
        <RoomForm
          room={currentRoom}
          onSave={handleSaveRoom}
          onCancel={() => setShowForm(false)}
          roomTypes={roomTypes}
        />
      ) : showHistory ? (
        <RoomHistoryView
          history={roomHistory.filter((h) => h.roomId === currentRoom?.id)}
          onBack={() => {
            setShowHistory(false);
            setShowForm(true);
          }}
        />
      ) : (
        <RoomList
          rooms={rooms}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          onViewHistory={handleViewHistory}
          loading={loading}
        />
      )}
    </div>
  );
}

/* ---------- Subcomponents (RoomList, RoomForm, RoomHistoryView) ---------- */

function RoomList({
  rooms,
  onEdit,
  onDelete,
  onViewHistory,
  loading,
}: {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
  onViewHistory: (roomId: string) => void;
  loading: boolean;
}) {
  return (
    <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">All Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
    <div className="p-6 flex justify-center items-center">
      <Loader2 className="animate-spin text-yellow-500" size={32} />
    </div>
  )  : rooms.length === 0 ? (
          <p className="text-center py-8 text-white/60">No rooms found. Add your first room.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-white/70 px-3 py-2 text-center w-[14%]">Room</th>
                    <th className="text-white/70 px-3 py-2 text-center w-[14%]">Type</th>
                    <th className="text-white/70 px-3 py-2 text-center w-[9%]">Status</th>
                    <th className="text-white/70 px-3 py-2 text-center w-[14%]">Capacity</th>
                    <th className="text-white/70 px-3 py-2 text-center w-[14%]">Price</th>
                    <th className="text-white/70 px-3 py-2 text-center w-[8%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-white/5">
                      <td className="font-medium text-white text-center px-2 py-1">{room.number}</td>
                      <td className="text-white/80 text-center px-2 py-1">{room.type}</td>
                      <td className="px-2 text-center  py-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            room.status === "available"
                              ? "bg-green-600/20 text-green-300"
                              : room.status === "occupied"
                              ? "bg-yellow-600/20 text-yellow-300"
                              : "bg-red-600/20 text-red-300"
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="text-white/80 text-center px-2 py-1">{room.capacity}</td>
                      <td className="text-white/80 text-center px-2 py-1">PKR {Number(room.price).toLocaleString()}</td>
                      <td className="flex gap-2 text-center px-2 py-1">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => onEdit(room)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white/5 text-white" onClick={() => onViewHistory(room.id)}>
                          History
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => onDelete(room.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {rooms.map((room) => (
                <Card key={room.id} className="bg-white/5 border border-white/20">
                  <CardContent className="p-3 text-white text-sm space-y-1">
                    <p><strong>Room:</strong> {room.number}</p>
                    <p><strong>Type:</strong> {room.type}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          room.status === "available"
                            ? "bg-green-600/20 text-green-300"
                            : room.status === "occupied"
                            ? "bg-yellow-600/20 text-yellow-300"
                            : "bg-red-600/20 text-red-300"
                        }`}
                      >
                        {room.status}
                      </span>
                    </p>
                    <p><strong>Capacity:</strong> {room.capacity}</p>
                    <p><strong>Price:</strong> PKR {Number(room.price).toLocaleString()}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => onEdit(room)}>Edit</Button>
                      <Button size="sm" variant="outline" className="bg-white/5 text-white" onClick={() => onViewHistory(room.id)}>History</Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => onDelete(room.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}


/* ---------- Subcomponents (RoomList, RoomForm, RoomHistoryView) ---------- */



function RoomForm({
  room,
  onSave,
  onCancel,
  roomTypes = [],
}: {
  room: Room | null;
  onSave: (room: Room) => void;
  onCancel: () => void;
  roomTypes: RoomType[];
}) {
  const [formData, setFormData] = useState<Room>(
    room || {
      id: "",
      number: "",
      type: roomTypes?.[0]?.name || "standard",
      status: "available",
      capacity: 2,
      price: 150,
      description: "",
    }
  );

  useEffect(() => {
    // when roomTypes change and we're creating new room, prefill price/type
    if (!room && roomTypes && roomTypes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        type: roomTypes[0].name,
        price: prev.price || Number(roomTypes[0].price_per_night || 0),
      }));
    }
    // if editing, load room
    if (room) {
      setFormData(room);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypes, room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "price" || name === "capacity" ? Number(value) : (value as any) });
  };

  const handleSelectChange = (name: string, value: string) => {
    // when switching type, prefill price from type if available
    const typeObj = roomTypes.find((t) => t.name === value);
    setFormData({
      ...formData,
      [name]: value,
      price: typeObj ? Number(typeObj.price_per_night || 0) : formData.price,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">{room ? "Edit Room" : "Add New Room"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80">Room Number *</Label>
                <Input name="number" value={formData.number} onChange={handleChange} required className="bg-white/10 border-white/30 text-white placeholder-white/50" />
              </div>
              <div>
                <Label className="text-white/80">Room Type *</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.length > 0 ? (
                      roomTypes.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)
                    ) : (
                      <>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="presidential">Presidential</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80">Status *</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white">
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
                <Label className="text-white/80">Capacity *</Label>
                <Input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" required className="bg-white/10 border-white/30 text-white" />
              </div>

              <div>
                <Label className="text-white/80">Price per night (PKR) *</Label>
                <Input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required className="bg-white/10 border-white/30 text-white" />
              </div>
            </div>

            <div>
              <Label className="text-white/80">Description</Label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded bg-white/10 border border-white/30 text-white placeholder-white/50 min-h-[100px]" />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" className="border-white/30 text-white bg-white/10 w-full sm:w-auto" onClick={onCancel}>Cancel</Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 w-full sm:w-auto">Save Room</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RoomHistoryView({ history, onBack }: { history: RoomHistory[]; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Room History</CardTitle>
            <Button variant="outline" className="bg-white/5 text-whit" onClick={onBack}>Back</Button>
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center py-8 text-white/60">No history found for this room.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-white/70 text-center px-2 py-1">Guest Name</th>
                    <th className="text-white/70 text-center px-2 py-1">Contact</th>
                    <th className="text-white/70 text-center px-2 py-1">Check-in</th>
                    <th className="text-white/70 text-center px-2 py-1">Check-out</th>
                    <th className="text-white/70 text-center px-2 py-1">Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id} className="hover:bg-white/5">
                      <td className="text-white text-center px-2 py-1">{record.guestName}</td>
                      <td className="text-white/80 text-center px-2 py-1">{record.guestContact}</td>
                      <td className="text-white/80 text-center px-2 py-1">{new Date(record.checkIn).toLocaleDateString()}</td>
                      <td className="text-white/80 text-center px-2 py-1">{new Date(record.checkOut).toLocaleDateString()}</td>
                      <td className="text-white/60 text-center px-2 py-1">{new Date(record.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
