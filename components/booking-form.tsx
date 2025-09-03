// components/booking-form.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Bed } from "lucide-react";

type RoomType = {
  id: string;
  name: string;
  price_per_night?: number;
  price_per_hour?: number;
  currency?: string;
};

interface BookingFormProps {
  onClose?: () => void;
  onBooked?: (resp: any) => void;
}

export default function BookingForm({ onClose, onBooked }: BookingFormProps) {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "",
    rateUnit: "night",
    name: "",
    email: "",
    phone: "",
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTypes(true);
        const res = await fetch("/api/room-types");
        const data = await res.json();
        if (!mounted) return;
        if (data?.ok && Array.isArray(data.room_types)) {
          setRoomTypes(data.room_types);
          if (!formData.roomType && data.room_types.length > 0) {
            setFormData((f) => ({ ...f, roomType: data.room_types[0].name }));
          }
        } else if (Array.isArray(data)) {
          setRoomTypes(data);
        }
      } catch (err) {
        console.error("Failed to load room types", err);
      } finally {
        if (mounted) setLoadingTypes(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lock background scroll while modal is open
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev || "";
    };
  }, []);

  const toDate = (iso?: string) => (iso ? new Date(iso) : null);

  const estimate = useMemo(() => {
    const { checkIn, checkOut, roomType, rateUnit } = formData;
    if (!checkIn || !checkOut || !roomType) return null;
    const t = roomTypes.find((r) => r.name === roomType || r.id === roomType);
    if (!t) return null;

    const ci = toDate(checkIn);
    const co = toDate(checkOut);
    if (!ci || !co) return null;
    const ms = co.getTime() - ci.getTime();
    if (ms <= 0) return null;

    if (rateUnit === "night") {
      const nights = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
      const pricePerNight = Number(t.price_per_night ?? 0);
      const total = nights * pricePerNight;
      return {
        unit: "night",
        count: nights,
        unitPrice: pricePerNight,
        total,
        currency: t.currency ?? "PKR",
      };
    } else {
      const hours = Math.max(1, Math.ceil(ms / (1000 * 60 * 60)));
      const pricePerHour = Number(t.price_per_hour ?? 0);
      const total = hours * pricePerHour;
      return {
        unit: "hour",
        count: hours,
        unitPrice: pricePerHour,
        total,
        currency: t.currency ?? "PKR",
      };
    }
  }, [formData, roomTypes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // helper: today's ISO date (yyyy-mm-dd)
  const todayStr = new Date().toISOString().split("T")[0];

  // helper: next day string for a given ISO date
  const nextDateStr = (iso?: string) => {
    if (!iso) return todayStr;
    const d = new Date(iso);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const ci = toDate(formData.checkIn);
  const co = toDate(formData.checkOut);
  const checkoutInvalid = Boolean(ci && co && co <= ci);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill full name, email and phone.");
      return;
    }
    if (!formData.roomType || !formData.checkIn || !formData.checkOut) {
      alert("Please select room type and dates.");
      return;
    }
    if (!ci || !co || co <= ci) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roomType: formData.roomType,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          guests: Number(formData.guests) || 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      alert(
        `Booking confirmed! Room ${data.room?.number ?? "—"} assigned to ${
          formData.name
        }. Total: ${
          data.booking?.price
            ? `PKR ${Number(data.booking.price).toLocaleString()}`
            : "—"
        }`
      );

      if (onBooked) onBooked(data);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bottom-10"
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!submitting && onClose) onClose();
        }}
        aria-hidden
      />

      {/* modal card: limit height and allow internal scrolling on small screens */}
      <motion.div
        initial={{ scale: 0.98, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 10, opacity: 0 }}
        className="relative w-full max-w-2xl mx-auto bottom-10 top-10"
      >
        <div
          className="rounded-2xl overflow-hidden border border-white/10 backdrop-blur-2xl bg-gradient-to-br from-white/2 to-white/5"
          style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }}
        >
          <Card className="bg-transparent shadow-none">
            <CardHeader className="px-4 sm:px-6 py-3 bg-transparent">
              <CardTitle className="flex items-center justify-between text-white text-base sm:text-lg">
                <span className="font-semibold">
                  Book Your Stay • Marigold Hotel
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => onClose && onClose()}
                    className="text-white/80 hover:text-white rounded p-2"
                    aria-label="Close booking form"
                  >
                    ✕
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* constrain height and allow vertical scroll on small screens */}
            <CardContent className="p-4 sm:p-6 max-h-[80vh] overflow-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2 align-middle" />
                      Check-in
                    </label>
                    <input
                      name="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={handleChange}
                      required
                      min={todayStr}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 placeholder-white/50 focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      <Calendar className="inline w-4 h-4 mr-2 align-middle" />
                      Check-out
                    </label>
                    <input
                      name="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={handleChange}
                      required
                      // enforce check-out to be at least one day after check-in
                      min={
                        formData.checkIn
                          ? nextDateStr(formData.checkIn)
                          : nextDateStr(undefined)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 placeholder-white/50 focus:ring-2 focus:ring-yellow-500"
                    />
                    {checkoutInvalid && (
                      <p className="mt-1 text-xs text-rose-400">
                        Check-out must be after check-in.
                      </p>
                    )}
                  </div>
                </div>

                {/* Guests + Room Type + Rate Unit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      <Users className="inline w-4 h-4 mr-2 align-middle" />
                      Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 focus:bg-gray-800 focus:text-white"
                    >
                      {[1, 2, 3, 4].map((g) => (
                        <option
                          key={g}
                          className="text-black bg-white"
                          value={g}
                        >
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      <Bed className="inline w-4 h-4 mr-2 align-middle" />
                      Room Type
                    </label>
                    {loadingTypes ? (
                      <div className="px-3 py-2 rounded-lg bg-white/5 text-white/60">
                        Loading types…
                      </div>
                    ) : (
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10 focus:bg-gray-800 focus:text-white"
                      >
                        <option className="text-black bg-white" value="">
                          Select a type
                        </option>
                        {roomTypes.map((t) => (
                          <option
                            key={t.id}
                            value={t.name}
                            className="text-black bg-white"
                          >
                            {t.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Rate unit
                    </label>
                    <div className="flex gap-2">
                      {["night", "hour"].map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() =>
                            setFormData((s) => ({ ...s, rateUnit: unit }))
                          }
                          className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                            formData.rateUnit === unit
                              ? "bg-yellow-500 text-black"
                              : "bg-white/5 text-white/80"
                          }`}
                        >
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estimate */}
                {estimate ? (
                  <div className="rounded-lg p-3 bg-white/3 border border-white/8 text-white text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="text-white/80">
                          Estimated (
                          {estimate.unit === "night" ? "nights" : "hours"}):{" "}
                          <span className="font-medium text-white">
                            {estimate.count} {estimate.unit}(s)
                          </span>
                        </div>
                        <div className="text-white/80">
                          Unit price:{" "}
                          <span className="font-medium text-white">
                            PKR {Number(estimate.unitPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/80">Total</div>
                        <div className="text-lg font-semibold text-white">
                          PKR {Number(estimate.total).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-white/60">
                    Select dates and room type to see an estimate
                  </div>
                )}

                {/* Personal Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">
                    Personal information
                  </h4>
                  <div>
                    <label className="text-sm text-white/80 block mb-1">
                      Full name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-white/80 block mb-1">
                        Email
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-white/80 block mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/10"
                        placeholder="+92 300 0000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Booking…" : "Submit Booking Request"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => onClose && onClose()}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 text-white/80"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
