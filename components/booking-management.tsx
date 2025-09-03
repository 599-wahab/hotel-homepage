// components/booking-management.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Bed,
  Plus,
  Search,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import BookingForm from "@/components/booking-form";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [res, rt] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/room-types"),
      ]);

      const data = await res.json().catch(() => ({}));
      const types = await rt.json().catch(() => ({}));

      if (data?.ok) setBookings(data.bookings || []);
      else if (Array.isArray(data)) setBookings(data);

      if (types?.ok) setRoomTypes(types.room_types || []);
      else if (Array.isArray(types)) setRoomTypes(types);
    } catch (err) {
      console.error("Failed to fetch bookings/types", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const isPastCheckout = (b: any) => {
    const checkout = b.checkout_date ?? b.checkOut;
    if (!checkout) return false;
    const co = new Date(checkout);
    const now = new Date();
    return now >= co;
  };

  const setRowBusy = (id: string, v: boolean) =>
    setRowLoading((s) => ({ ...s, [id]: v }));

  const handleCheckIn = async (id: string) => {
    if (!confirm("Mark this booking as CHECKED IN now?")) return;
    try {
      setRowBusy(id, true);
      const res = await fetch(`/api/bookings/${id}/checkin`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        alert(data?.error || "Check-in failed");
        return;
      }
      const updated = data.booking ?? data;
      if (updated) {
        setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        fetchBookings();
      }
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Network error during check-in");
    } finally {
      setRowBusy(id, false);
    }
  };

  const handleCheckOut = async (id: string) => {
    if (!confirm("Mark this booking as CHECKED OUT now?")) return;
    try {
      setRowBusy(id, true);
      const res = await fetch(`/api/bookings/${id}/checkout`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        alert(data?.error || "Check-out failed");
        return;
      }
      const updated = data.booking ?? data;
      if (updated) {
        setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        fetchBookings();
      }
    } catch (err) {
      console.error("Check-out error:", err);
      alert("Network error during check-out");
    } finally {
      setRowBusy(id, false);
    }
  };

  const handleOnBooked = (data: any) => {
    const newBooking = data?.booking ?? data;
    if (!newBooking) {
      fetchBookings();
    } else {
      setBookings((prev) => [newBooking, ...prev]);
    }
    setShowForm(false);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      (b.guest_name ?? b.name ?? "")
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (b.room_type ?? b.roomType ?? "")
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-600/20 text-green-300";
      case "pending":
        return "bg-yellow-600/20 text-yellow-300";
      case "checked_in":
        return "bg-blue-600/20 text-blue-300";
      case "checked_out":
        return "bg-gray-700/20 text-gray-300";
      case "cancelled":
        return "bg-red-600/20 text-red-300";
      default:
        return "bg-white/10 text-white/80";
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-white/70">
            Manage all hotel reservations and create bookings
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-500"
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

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/6 rounded-xl border border-white/10 shadow-sm overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="animate-spin text-yellow-500" size={28} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm divide-y divide-white/10">
              <thead className="bg-white/5 text-white/70 uppercase">
                <tr>
                  <th className="px-3 py-2 text-left w-[14%]">Guest</th>
                  <th className="px-3 py-2 text-left w-[16%]">Contact</th>
                  <th className="px-3 py-2 text-left w-[14%]">Room</th>
                  <th className="px-3 py-2 text-left w-[12%]">Check-in</th>
                  <th className="px-3 py-2 text-left w-[12%]">Check-out</th>
                  <th className="px-3 py-2 text-left w-[15%]">Times</th>
                  <th className="px-3 py-2 text-left w-[9%]">Status</th>
                  <th className="px-3 py-2 text-left w-[8%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-white/60" colSpan={8}>
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const id = b.id ?? `${b.guest_name ?? b.name}-${b.checkin_date ?? b.checkIn}`;
                    const loadingRow = Boolean(rowLoading[id]);
                    const status = (b.status ?? "").toString().toLowerCase();
                    const pastCheckout = isPastCheckout(b);

                    return (
                      <tr key={id} className="hover:bg-white/5 transition">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <User className="text-yellow-400" size={14} />
                          <span>{b.guest_name ?? b.name ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2 text-white/80">
                          {b.guest_email && (
                            <div className="flex items-center gap-1">
                              <Mail size={12} className="text-white/40" />
                              <span>{b.guest_email}</span>
                            </div>
                          )}
                          {b.guest_phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={12} className="text-white/40" />
                              <span>{b.guest_phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 flex items-center gap-1">
                          <Bed size={12} className="text-white/60" />
                          <span>
                            {b.room_type} {b.room_number ? `#${b.room_number}` : ""}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Calendar size={12} className="text-white/60 inline mr-1" />
                          {b.checkin_date
                            ? new Date(b.checkin_date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Calendar size={12} className="text-white/60 inline mr-1" />
                          {b.checkout_date
                            ? new Date(b.checkout_date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-3 py-2 text-white/80 whitespace-nowrap">
                          In: {b.checkin_time ? new Date(b.checkin_time).toLocaleTimeString() : "—"} | Out:{" "}
                          {b.actual_checkout ? new Date(b.actual_checkout).toLocaleTimeString() : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(
                              b.status
                            )}`}
                          >
                            {status || "—"}
                          </span>
                          {pastCheckout && status !== "checked_out" && (
                            <span className="block text-[10px] text-rose-300">Due</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-2">
                            {status !== "checked_in" && status !== "checked_out" && (
                              <button
                                onClick={() => handleCheckIn(id)}
                                disabled={loadingRow}
                                className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
                              >
                                {loadingRow ? "…" : "In"}
                              </button>
                            )}
                            {status !== "checked_out" && (
                              <button
                                onClick={() => handleCheckOut(id)}
                                disabled={loadingRow || status === "pending"}
                                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                              >
                                {loadingRow ? "…" : "Out"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-white/60">No bookings found.</div>
        ) : (
          filteredBookings.map((b) => {
            const id = b.id ?? `${b.guest_name}-${b.checkin_date}`;
            const loadingRow = Boolean(rowLoading[id]);
            const status = (b.status ?? "").toString().toLowerCase();
            const pastCheckout = isPastCheckout(b);

            return (
              <div key={id} className="bg-white/5 p-4 rounded-lg border border-white/10 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <User size={14} className="text-yellow-400" />
                    {b.guest_name ?? "—"}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(b.status)}`}>
                    {status || "—"}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-white/80">
                  {b.guest_email && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-white/40" />
                      {b.guest_email}
                    </div>
                  )}
                  {b.guest_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-white/40" />
                      {b.guest_phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Bed size={12} className="text-white/40" />
                    {b.room_type} {b.room_number ? `#${b.room_number}` : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-white/40" />
                    In: {b.checkin_date ? new Date(b.checkin_date).toLocaleDateString() : "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-white/40" />
                    Out: {b.checkout_date ? new Date(b.checkout_date).toLocaleDateString() : "—"}
                  </div>
                  <div>
                    Times: In: {b.checkin_time ? new Date(b.checkin_time).toLocaleTimeString() : "—"} | Out:{" "}
                    {b.actual_checkout ? new Date(b.actual_checkout).toLocaleTimeString() : "—"}
                  </div>
                  {pastCheckout && status !== "checked_out" && (
                    <span className="text-[11px] text-rose-300">Due</span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  {status !== "checked_in" && status !== "checked_out" && (
                    <button
                      onClick={() => handleCheckIn(id)}
                      disabled={loadingRow}
                      className="flex-1 px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs disabled:opacity-50"
                    >
                      {loadingRow ? "…" : "Check In"}
                    </button>
                  )}
                  {status !== "checked_out" && (
                    <button
                      onClick={() => handleCheckOut(id)}
                      disabled={loadingRow || status === "pending"}
                      className="flex-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                    >
                      {loadingRow ? "…" : "Check Out"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <BookingForm
          onClose={() => setShowForm(false)}
          onBooked={(data: any) => handleOnBooked(data)}
        />
      )}
    </div>
  );
}
