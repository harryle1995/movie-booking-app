import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MovieList from './components/MovieList'
import Home from './components/Home'
import MovieDetail from './components/MovieDetail';
import MovieListEditor from './components/MovieListEditor';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import TicketBooking from './components/TicketBooking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-stone-950 pt-10 flex-grow flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/editing"
            element={
              <ProtectedAdminRoute>
                <MovieListEditor />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/now-showing" element={<MovieList />} />
          <Route path="/now-showing/:id" element={<MovieDetail />} />
          <Route path="/now-showing/:id/:showtimeId" element={<TicketBooking />} />
        </Routes>
      </div>

      <Footer />

      {/* Toast container for global notifications */}
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  )
}

export default App
