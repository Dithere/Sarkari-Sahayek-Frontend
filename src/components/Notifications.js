import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export default function Notifications({ onSelectNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/notifications");
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.length); // Simple unread counter
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  const handleSee = (notif) => {
    onSelectNotification(notif.question);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-700 transition">
        <Bell className="w-6 h-6 text-indigo-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
          <div className="p-2 flex justify-between items-center border-b border-gray-700">
            <span className="font-semibold text-gray-100">Notifications</span>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-400">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-3 border-b border-gray-700 hover:bg-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-gray-100 font-medium">{notif.title}</p>
                  <p className="text-gray-400 text-xs">{notif.time}</p>
                </div>
                <button
                  onClick={() => handleSee(notif)}
                  className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-500 text-sm"
                >
                  See
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
