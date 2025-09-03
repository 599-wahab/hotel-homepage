// components/NotificationHandler.tsx
"use client";

import { useEffect, useState } from "react";

export default function NotificationHandler() {
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Mark once the user interacts
    const handleUserInteraction = () => {
      setUserInteracted(true);
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (!userInteracted) return;

    async function fetchNotifications() {
      const res = await fetch("/api/notifications?unread=true");
      const data = await res.json();

      if (data.ok && data.notifications.length > 0) {
        const latest = data.notifications[0];

        // Play a sound safely
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch((err) => {
          console.warn("Audio blocked:", err);
        });

        // Show browser notification (if permission granted)
        if (Notification.permission === "granted") {
          new Notification("New Notification", {
            body: latest.message ?? "You have a new notification!",
            icon: "/placeholder-logo.png", // ✅ fixed path
          });
        }
      }
    }

    // Ask for notification permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 👉 Fetch immediately on first interaction
    fetchNotifications();

    // Poll every 20s afterwards
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [userInteracted]);

  return null;
}
