import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const rows = 8;
const cols = 12;
const TICKET_PRICE = 10; // USD per seat

// Load Stripe key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Generate seat labels like A1, A2, ..., H12
const generateSeats = () =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`)
  );

export default function TicketBooking() {
  const { showtimeId } = useParams(); // get showtimeId from URL
  const [showtimeInfo, setShowtimeInfo] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const seats = generateSeats();
  const API = import.meta.env.VITE_API_URL;

  // Load movie info and already-booked seats
  useEffect(() => {
    fetch(`${API}/booking/showtimes/${showtimeId}`)
      .then((res) => res.json())
      .then((data) => setShowtimeInfo(data))
      .catch((err) => console.error("Error fetching showtime info:", err));

    fetch(`${API}/booking/showtimes/${showtimeId}/seats`)
      .then((res) => res.json())
      .then((data) => setBookedSeats(data.bookedSeats))
      .catch((err) => console.error("Error fetching booked seats:", err));
  }, [showtimeId]);

  // Format ISO date to readable string
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

  // Add/remove seat from selectedSeats
  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Stripe Checkout handler
  const handlePayment = async () => {
    const stripe = await stripePromise;
    const quantity = selectedSeats.length;

    if (quantity === 0) return alert("Please select at least one seat.");

    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) return alert("You must be logged in to book.");

    try {
      // Create Checkout Session with backend
      const response = await fetch(`${API}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          showtimeId,
          selectedSeats,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed.');
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

      {/* Screen label */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-black text-white text-center py-2 rounded mb-4">SCREEN</div>

        {/* Seating grid */}
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
                          : 'bg-gray-300 text-black hover:bg-gray-400'}`}
                  >
                    {seat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Booking Summary and Pay */}
        <div className="mt-8 p-4 border border-white rounded text-white bg-transparent">
          <h2 className="text-lg font-semibold mb-2">Selected Seats</h2>
          <p>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>

          <p className="mt-2 text-sm">
            Tickets: {selectedSeats.length} × ${TICKET_PRICE} ={' '}
            <strong>${selectedSeats.length * TICKET_PRICE}</strong>
          </p>

          <button
            onClick={handlePayment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={selectedSeats.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
