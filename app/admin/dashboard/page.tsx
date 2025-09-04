// app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import AdminNotifications from "@/components/admin-notifications";
import RoomManagement from "@/components/room-management";
import BookingManagement from "@/components/booking-management";
import ServiceManagement from "@/components/service-management";
import {
  Bed,
  Calendar,
  ConciergeBell,
  Info,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

/* ---------- Types ---------- */
type Room = {
  id: string;
  number?: string;
  type?: string;
  status?: "available" | "occupied" | "maintenance" | string;
  capacity?: number;
  price?: number | string;
};

type Booking = {
  id: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  room_id?: string | null;
  room_number?: string | null;
  room_type?: string | null;
  checkin_date?: string;
  checkout_date?: string;
  status?: string;
  created_at?: string;
};

/* ---------- Component ---------- */
export default function AdminDashboard() {
  const router = useRouter();

  // auth + client-only
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (!isAdminLoggedIn()) {
      router.push("/admin/login");
    }
  }, [router]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    | "dashboard"
    | "rooms"
    | "bookings"
    | "dining"
    | "facilities"
    | "services"
    | "maintenance"
    | "bills"
    | "profile"
  >("dashboard");

  // data state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch helper
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch("/api/rooms").then((r) => r.json()).catch(() => []),
        fetch("/api/bookings").then((r) => r.json()).catch(() => []),
      ]);

      setRooms(Array.isArray(roomsRes) ? roomsRes : roomsRes.rooms ?? []);
      setBookings(Array.isArray(bookingsRes) ? bookingsRes : bookingsRes.bookings ?? []);
    } catch (err: any) {
      console.error(err);
      setError(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 20000);
    return () => clearInterval(id);
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const totalRooms = rooms.length || 1;
    const occupancyRate = Math.round((occupied / totalRooms) * 100);

    let revenue = 0;
    bookings.forEach((b) => {
      if (!b.checkin_date || !b.checkout_date) return;
      if (b.status?.toLowerCase() === "cancelled") return;
      const checkin = new Date(b.checkin_date);
      const checkout = new Date(b.checkout_date);
      const nights = Math.max(
        0,
        Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
      );
      const room = rooms.find((r) => r.id === b.room_id || r.number === b.room_number);
      revenue += (Number(room?.price ?? 0)) * nights;
    });

    const pendingRequests = bookings.filter((b) => b.status?.toLowerCase() === "pending").length;

    return {
      totalBookings,
      occupancyRate: isNaN(occupancyRate) ? 0 : occupancyRate,
      revenue: Math.round(revenue * 100) / 100,
      pendingRequests,
    };
  }, [rooms, bookings]);

  // Recent bookings
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          (new Date(b.created_at ?? 0).getTime() || 0) -
          (new Date(a.created_at ?? 0).getTime() || 0)
      )
      .slice(0, 8);
  }, [bookings]);

  if (!isClient) return null;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen relative bg-neutral-900">
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/marigol-1.png')", filter: "brightness(0.45) saturate(0.9)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10" />

      <div className="relative z-20 flex h-full">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`absolute md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
            md:translate-x-0 w-[260px]
            bg-gradient-to-b from-yellow-800/95 to-yellow-700/95 text-white shadow-xl flex flex-col
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="px-6 py-5 flex items-center gap-3 border-b border-yellow-600">
            <div className="bg-yellow-500 p-2 rounded-lg shadow-sm">
              <Bed size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Marigold Hotel</h1>
              <p className="text-yellow-200 text-xs">Admin Dashboard</p>
            </div>
          </div>

          {/* Improved nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {[
              { id: "dashboard", name: "Dashboard", icon: <Calendar size={16} /> },
              { id: "rooms", name: "Room Management", icon: <Bed size={16} /> },
              { id: "bookings", name: "Bookings", icon: <Calendar size={16} /> },
              { id: "dining", name: "Dining", icon: <ConciergeBell size={16} /> },
              { id: "facilities", name: "Facilities", icon: <Info size={16} /> },
              { id: "services", name: "Services", icon: <Info size={16} /> },
              { id: "maintenance", name: "Maintenance", icon: <Info size={16} /> },
              { id: "bills", name: "Billing", icon: <Info size={16} /> },
              { id: "profile", name: "Profile", icon: <Bed size={16} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTab(t.id as any);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition text-sm font-medium duration-150
                  ${selectedTab === t.id
                    ? "bg-yellow-600/95 border-l-4 border-yellow-300 text-white"
                    : "hover:bg-yellow-600/30 text-yellow-100"}`}
              >
                <span className="flex-shrink-0">{t.icon}</span>
                <span className="truncate">{t.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 backdrop-blur-md bg-white/10">
            <div className="flex items-center justify-between px-4 md:px-8 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((s) => !s)}
                  className="md:hidden p-2 rounded bg-white/6 hover:bg-white/12"
                >
                  {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <h2 className="text-lg font-semibold text-white/95 capitalize">
                  {selectedTab}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <AdminNotifications />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6 lg:p-8">
            {selectedTab === "dashboard" && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard title="Total Bookings" value={String(stats.totalBookings)} icon={<Calendar />} />
                  <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={<Bed />} />
                  <StatCard title="Revenue" value={`PKR ${stats.revenue.toLocaleString()}`} icon={<ConciergeBell />} />
                  <StatCard title="Pending Requests" value={String(stats.pendingRequests)} icon={<Info />} />
                </div>

                {/* Recent + Occupancy */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Bookings */}
                  <div className="bg-white/6 border border-white/10 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white/95">Recent Bookings</h3>
                      <button onClick={fetchData} className="text-sm text-white/80 hover:text-white">Refresh</button>
                    </div>

                    {/* Desktop table */}
                    <div className="overflow-x-auto hidden md:block">
                      <table className="min-w-full text-sm text-white/90">
                        <thead className="text-xs text-white/70 border-b border-white/12">
                          <tr>
                            <th className="py-3 px-2">Guest</th>
                            <th className="py-3 px-2">Room</th>
                            <th className="py-3 px-2">Check-in</th>
                            <th className="py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-white/5">
                              <td className="py-3 text-center px-2">{b.guest_name ?? "—"}</td>
                              <td className="py-3 text-center px-2">{b.room_number ?? b.room_type ?? "—"}</td>
                              <td className="py-3 text-center px-2">
                                {b.checkin_date ? new Date(b.checkin_date).toLocaleDateString() : "—"}
                              </td>
                              <td className="py-3 text-center px-2"><StatusBadge status={b.status ?? "unknown"} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                      {recentBookings.length === 0 ? (
                        <div className="py-6 text-center text-white/70">No bookings</div>
                      ) : (
                        recentBookings.map((b) => (
                          <div key={b.id} className="p-3 rounded-lg bg-white/10 border border-white/15">
                            <p className="text-sm font-medium text-white">{b.guest_name ?? "—"}</p>
                            <p className="text-xs text-white/70">Room: {b.room_number ?? b.room_type ?? "—"}</p>
                            <p className="text-xs text-white/70">Check-in: {b.checkin_date ? new Date(b.checkin_date).toLocaleDateString() : "—"}</p>
                            <div className="mt-2"><StatusBadge status={b.status ?? "unknown"} small /></div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="bg-white/6 border border-white/10 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 text-white/95">Room Occupancy</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rooms.length === 0 ? (
                        <div className="col-span-full text-center py-6 text-white/70">No rooms</div>
                      ) : (
                        rooms.map((r) => (
                          <div key={r.id} className="p-3 border border-white/8 rounded-lg bg-white/4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-white/95">{r.number ?? "—"}</div>
                                <div className="text-xs text-white/70">{r.type ?? "—"}</div>
                              </div>
                              <StatusBadge status={r.status ?? "available"} small />
                            </div>
                            <div className="mt-3 text-sm text-white/70">
                              PKR {Number(r.price ?? 0).toLocaleString()}/night
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tabs */}
            {selectedTab === "rooms" && <RoomManagement />}
            {selectedTab === "bookings" && <BookingManagement />}
            {selectedTab === "services" && <ServiceManagement />}
            {selectedTab === "dining" && <DiningManagement />}
            {selectedTab === "facilities" && <FacilitiesManagement />}
            {selectedTab === "maintenance" && <MaintenanceManagement />}
            {selectedTab === "bills" && <BillingManagement />}
            {selectedTab === "profile" && <ProfileManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/6 p-4 rounded-lg border border-white/8 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/80">{title}</p>
          <p className="text-xl font-bold mt-1 text-white">{value}</p>
        </div>
        <div className="p-2 bg-yellow-100/20 rounded">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const s = (status || "").toLowerCase();
  let cls = "bg-white/10 text-white/80";

  switch (s) {
    case "confirmed":
      cls = "bg-blue-600/20 text-blue-400";
      break;
    case "occupied":
      cls = "bg-yellow-600/20 text-yellow-300";
      break;
    case "available":
      cls = "bg-emerald-600/20 text-emerald-400";
      break;
    case "pending":
      cls = "bg-yellow-600/20 text-yellow-400";
      break;
    case "cancelled":
      cls = "bg-red-600/20 text-red-400";
      break;
    case "maintenance":
      cls = "bg-orange-600/20 text-orange-400";
      break;
    case "checked_in":
      cls = "bg-cyan-600/20 text-cyan-400";
      break;
    case "checked_out":
      cls = "bg-purple-600/20 text-purple-400";
      break;
    default:
      cls = "bg-gray-600/20 text-gray-300";
      break;
  }

  return (
    <span
      className={`${cls} inline-flex items-center px-2 py-0.5 rounded-full ${
        small ? "text-xs" : "text-sm"
      }`}
    >
      {status}
    </span>
  );
}


/* ---------- Placeholders ---------- */
function DiningManagement() { return <div className="bg-white p-6 rounded-xl">Dining Management</div>; }
function FacilitiesManagement() { return <div className="bg-white p-6 rounded-xl">Facilities Management</div>; }
function MaintenanceManagement() { return <div className="bg-white p-6 rounded-xl">Maintenance Management</div>; }
function BillingManagement() { return <div className="bg-white p-6 rounded-xl">Billing Management</div>; }
function ProfileManagement() { return <div className="bg-white p-6 rounded-xl">Profile Management</div>; }
