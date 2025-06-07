import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import MovieList from './components/MovieList'
import Home from './components/Home'
import MovieDetail from './components/MovieDetail';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-stone-950 pt-10 flex-grow flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/now-showing" element={<MovieList />} />
          <Route path="/now-showing/:id" element={<MovieDetail />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
