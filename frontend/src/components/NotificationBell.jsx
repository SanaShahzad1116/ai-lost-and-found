import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // har 30 second mein refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await API.put(`/notifications/${notification._id}/read`);
        setNotifications(notifications.map((n) => (n._id === notification._id ? { ...n, read: true } : n)));
      } catch (err) {
        console.error(err);
      }
    }
    setOpen(false);
    if (notification.item) navigate(`/item/${notification.item}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-96 overflow-y-auto z-50">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-900">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition text-sm ${
                  !n.read ? 'bg-indigo-50/50' : ''
                }`}
              >
                <p className="text-slate-700">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;