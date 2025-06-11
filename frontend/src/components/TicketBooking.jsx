import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const rows = 8;
const cols = 12;

const generateSeats = () =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`)
  );

export default function TicketBooking() {
  const { showtimeId } = useParams();
  const [showtimeInfo, setShowtimeInfo] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const seats = generateSeats();

  useEffect(() => {
    fetch(`http://localhost:5000/booking/showtimes/${showtimeId}`)
      .then((res) => res.json())
      .then((data) => setShowtimeInfo(data))
      .catch((err) => console.error("Error fetching showtime info:", err));

    fetch(`http://localhost:5000/booking/showtimes/${showtimeId}/seats`)
      .then((res) => res.json())
      .then((data) => setBookedSeats(data.bookedSeats))
      .catch((err) => console.error("Error fetching booked seats:", err));
  }, [showtimeId]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/booking/showtimes/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // temporary hardcoded user
          showtimeId,
          selectedSeats,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Booking successful!');
        setBookedSeats((prev) => [...prev, ...data.bookedSeats]);
        setSelectedSeats([]);
      } else {
        alert(data.error || 'Failed to book seats');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white font-bold mb-4">Select Your Seats</h1>

      {showtimeInfo ? (
        <p className="text-gray-600 mb-6">
          {showtimeInfo.movie.title} — {formatDateTime(showtimeInfo.start_time)}
        </p>
      ) : (
        <p className="text-gray-600 mb-6">Loading showtime info...</p>
      )}

      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-black text-white text-center py-2 rounded mb-4">SCREEN</div>

        <div className="grid grid-cols-12 gap-2 justify-center">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="col-span-12 flex justify-center">
              {row.map((seat) => {
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    aria-label={`Seat ${seat}`}
                    disabled={isBooked}
                    className={`w-10 h-10 m-1 rounded text-sm font-semibold transition-colors duration-150
                      ${isBooked
                        ? 'bg-red-600 text-white cursor-not-allowed'
                        : isSelected
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-black hover:bg-gray-400'}
                    `}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 border border-white rounded text-white bg-transparent">
          <h2 className="text-lg font-semibold mb-2">Selected Seats</h2>
          <p>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={selectedSeats.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}