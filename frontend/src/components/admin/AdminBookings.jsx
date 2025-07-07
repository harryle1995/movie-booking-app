import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/'); // Redirect if not admin
      return;
    }

    async function fetchAllBookings() {
      try {
        const res = await axios.get(`${API}/admin/bookings`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    }

    fetchAllBookings();
  }, [user, navigate]);

  if (!user?.is_admin) {
    return <p className="p-4 text-red-500">Access denied. Admins only.</p>;
  }

  return (
    <div className="p-6 text-amber-100">
      <h2 className="text-3xl font-bold mb-6 text-amber-200">All Bookings (Admin)</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto bg-gray-900 border border-gray-700 rounded-lg">
          <thead className="bg-gray-800 text-left text-amber-300">
            <tr>
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Movie</th>
              <th className="px-6 py-3">Showtime</th>
              <th className="px-6 py-3">Seats</th>
              <th className="px-6 py-3">Booked At</th>
              <th className="px-6 py-3">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={b.booking_id} className={idx % 2 === 0 ? "bg-gray-950" : "bg-gray-800"}>
                <td className="px-6 py-4">{b.booking_id}</td>
                <td className="px-6 py-4">{b.username}</td>
                <td className="px-6 py-4">{b.movie_title}</td>
                <td className="px-6 py-4">
                  {new Date(b.showtime_datetime).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4">
                    {b.seats_quantity || 0}{" "}
                    <span className="text-gray-400">
                        ({b.seat_labels || "No seats"})
                    </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(b.booking_time).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-6 py-4 font-semibold">${b.total_price}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-500 italic">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
