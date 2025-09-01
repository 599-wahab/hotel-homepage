// components/admin-notifications.tsx
"use client"
import { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?unread=true");
      const data = await res.json();
      if (res.ok) setNotes(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const id = setInterval(fetchNotes, 15000);
    return () => clearInterval(id);
  }, []);

  const markRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : { markAll: true })
      });
      fetchNotes();
    } catch (e) { console.error(e) }
  };

  return (
    <div className="relative">
      <button onClick={() => fetchNotes()} className="px-3 py-1">
        Notifications {notes.length > 0 && <span className="ml-2 inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{notes.length}</span>}
      </button>

      {notes.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white border p-2 shadow-lg z-50">
          <div className="flex justify-between items-center">
            <strong>New notifications</strong>
            <button onClick={() => markRead(undefined)} className="text-sm text-blue-600">Mark all read</button>
          </div>
          <ul className="mt-2 space-y-2 max-h-56 overflow-auto">
            {notes.map(n => (
              <li key={n.id} className="border-b pb-2">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-600">{n.body}</div>
                <div className="text-xs mt-1 flex gap-2">
                  <button onClick={() => markRead(n.id)} className="text-xs text-yellow-600">Mark read</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
