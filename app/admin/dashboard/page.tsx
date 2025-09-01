// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect, JSX } from "react";
import { logoutAdmin, isAdminLoggedIn } from "@/lib/admin-auth";
import {
  Calendar,
  Bed,
  Utensils,
  ConciergeBell,
  Info,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  X,
} from "lucide-react";
import RoomManagement from "@/components/room-management";
import BookingManagement from "@/components/booking-management";
import ServiceManagement from "@/components/service-management";
import { useRouter } from "next/navigation";

type SelectedTab =
  | "dashboard"
  | "rooms"
  | "bookings"
  | "dining"
  | "facilities"
  | "services"
  | "maintenance"
  | "bills"
  | "profile";

type Tab = { id: SelectedTab; name: string; icon: JSX.Element };

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("dashboard");
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (!isAdminLoggedIn()) {
      router.push("/admin/login");
    }
  }, [router]);

  if (!isClient) return null;

  const tabs: Tab[] = [
    { id: "dashboard", name: "Dashboard", icon: <Bed size={18} /> },
    { id: "rooms", name: "Room Management", icon: <Bed size={18} /> },
    { id: "bookings", name: "Bookings", icon: <Calendar size={18} /> },
    { id: "dining", name: "Dining", icon: <Utensils size={18} /> },
    { id: "facilities", name: "Facilities", icon: <ConciergeBell size={18} /> },
    { id: "services", name: "Services", icon: <Info size={18} /> },
    { id: "maintenance", name: "Maintenance", icon: <Settings size={18} /> },
    { id: "bills", name: "Billing", icon: <Info size={18} /> },
    { id: "profile", name: "Profile", icon: <User size={18} /> },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:w-64 w-[260px]
          bg-gradient-to-b from-yellow-700 to-yellow-800 text-white shadow-xl flex flex-col`}
      >
        <div className="p-6 flex-shrink-0 border-b border-yellow-600">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-1 rounded-lg">
              <Bed size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Marigold Hotel</h1>
              <p className="text-yellow-200 text-xs">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-left rounded-md transition
                ${
                  selectedTab === tab.id
                    ? "bg-yellow-600/90 border-l-4 border-yellow-300"
                    : "hover:bg-yellow-600/50"
                }`}
            >
              <span className="mr-3">{tab.icon}</span>
              <span className="truncate">{tab.name}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center w-full px-4 py-3 text-left rounded-md hover:bg-yellow-600/50"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </nav>

        <div className="p-4 text-xs text-yellow-200 border-t border-yellow-600">
          © {new Date().getFullYear()} Marigold Hotel
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col overflow-auto">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                aria-label="Toggle navigation"
                className="p-2 rounded-md md:hidden text-gray-700 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {tabs.find((t) => t.id === selectedTab)?.name ?? "Dashboard"}
              </h2>
            </div>

            {/* Mobile user menu */}
            {mobileView ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 text-sm text-gray-600"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <ChevronDown size={16} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <span className="text-sm text-gray-600">Admin</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          {selectedTab === "dashboard" && <DashboardOverview />}
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
  );
}

/* Dashboard Overview */
function DashboardOverview() {
  const stats = [
    {
      label: "Total Bookings",
      value: "142",
      icon: <Calendar size={20} className="text-yellow-500" />,
    },
    {
      label: "Occupancy Rate",
      value: "78%",
      icon: <Bed size={20} className="text-yellow-500" />,
    },
    {
      label: "Revenue",
      value: "$42,380",
      icon: <ConciergeBell size={20} className="text-yellow-500" />,
    },
    {
      label: "Pending Requests",
      value: "12",
      icon: <Info size={20} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-1.5 bg-yellow-100 rounded-lg">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings & Room Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs overflow-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Recent Bookings
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs">Guest</th>
                  <th className="px-3 py-2 text-left text-xs">Room</th>
                  <th className="px-3 py-2 text-left text-xs">Check-in</th>
                  <th className="px-3 py-2 text-left text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm">
                      John Doe
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm">
                      Deluxe Suite
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm">
                      2023-06-1{i + 2}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-xs">
          <h3 className="text-base sm:text-lg font-semibold mb-3">
            Room Occupancy
          </h3>
          <div className="overflow-x-auto">
            <div className="h-52 min-w-[400px] flex items-end space-x-2 sm:space-x-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t"
                    style={{ height: `${30 + Math.random() * 70}%` }}
                  />
                  <span className="text-xs mt-2 text-gray-500">
                    Room {i + 101}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Placeholder Components */
function DiningManagement() {
  return <div className="bg-white p-6 rounded-xl">Dining Management</div>;
}
function FacilitiesManagement() {
  return <div className="bg-white p-6 rounded-xl">Facilities Management</div>;
}
function MaintenanceManagement() {
  return <div className="bg-white p-6 rounded-xl">Maintenance Management</div>;
}
function BillingManagement() {
  return <div className="bg-white p-6 rounded-xl">Billing Management</div>;
}
function ProfileManagement() {
  return <div className="bg-white p-6 rounded-xl">Profile Management</div>;
}
