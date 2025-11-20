import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/admin/notifications?limit=10`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/api/admin/notifications/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${BACKEND_URL}/api/admin/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await fetch(`${BACKEND_URL}/api/admin/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_ORDER":
        return (
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        );
      case "STATUS_UPDATE":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        );
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
      if (!showDropdown) {
        fetchNotifications();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [showDropdown]);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            fetchNotifications();
          }
        }}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-black border border-white/20 rounded-xl shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black">
              <div>
                <h3 className="text-white font-bold font1 text-lg">
                  Notifications
                </h3>
                <p className="text-white/60 text-xs font-body">
                  {unreadCount} unread
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-[#955E30] hover:text-[#955E30]/80 text-sm font-body font-semibold transition-colors disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    className="w-16 h-16 text-white/20 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-white/40 font-body">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.notification_id}
                      to={`/admin/orders`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.notification_id);
                        }
                        setShowDropdown(false);
                      }}
                      className={`p-4 hover:bg-white/5 transition-colors block ${
                        !notification.is_read ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        {getNotificationIcon(notification.type)}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-body font-semibold ${
                                notification.is_read
                                  ? "text-white/80"
                                  : "text-white"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="w-2 h-2 rounded-full bg-[#955E30] flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-white/60 text-sm font-body mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/40 font-body">
                            <span>{timeAgo(notification.created_at)}</span>
                            {notification.order_number && (
                              <>
                                <span>•</span>
                                <span>#{notification.order_number}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center sticky bottom-0 bg-black">
                <Link
                  to="/admin/orders"
                  onClick={() => setShowDropdown(false)}
                  className="text-[#955E30] hover:text-[#955E30]/80 text-sm font-body font-semibold transition-colors"
                >
                  View All Orders →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// HOW TO USE IN YOUR ADMIN NAVBAR/HEADER
// ============================================
/*

import AdminNotifications from './AdminNotifications';

// In your admin header/navbar component:
<div className="flex items-center gap-4">
  <AdminNotifications />
  <UserProfileDropdown />
</div>

*/
