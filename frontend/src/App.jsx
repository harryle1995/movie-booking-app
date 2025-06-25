// Import React and essential routing/navigation components
import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Import reusable layout components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Import main page components
import Home from './components/pages/Home'
import MovieList from './components/movies/MovieList'
import MovieDetail from './components/movies/MovieDetail'
import TicketBooking from './components/movies/TicketBooking'
import BookingHistory from './components/user/BookingHistory'
import PaymentSuccess from "./components/pages/PaymentSuccess";

// Admin-specific components
import MovieListEditor from './components/admin/MovieListEditor'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import AdminBookings from './components/admin/AdminBookings'

// Import toast notification system
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * App component is the main layout wrapper.
 * - Provides routing between pages
 * - Wraps content with header, footer, and a toast notification container
 */
const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global header */}
      <Header />
      
      {/* Page content area with dark theme background */}
      <div className="bg-stone-950 pt-10 flex-grow flex justify-center items-center">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<MovieList />} />
          <Route path="/now-showing/:id" element={<MovieDetail />} />
          <Route path="/now-showing/:id/:showtimeId" element={<TicketBooking />} />

          {/* User route */}
          <Route path="/user/booking-history" element={<BookingHistory />} />

          {/* Payment success */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Admin route (protected) */}
          <Route
            path="/admin/editing"
            element={
              <ProtectedAdminRoute>
                <MovieListEditor />
              </ProtectedAdminRoute>
            }
          />

          {/* Admin booking route */}
          <Route
            path="/admin/bookings"
            element={
              <ProtectedAdminRoute>
                <AdminBookings />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </div>

      {/* Global footer */}
      <Footer />

      {/* Toasts for success/error messages (login, edits, etc.) */}
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  )
}

export default App
