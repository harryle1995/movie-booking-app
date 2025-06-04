// React
import React, { useState } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
import MovieList from './components/MovieList';


const App = () => {
  const [view, setView] = useState('home')

  return (
    <div className="min-h-screen flex flex-col">

      <Header 
        onNowShowingClick={() => setView('now-showing')}
        onHomeClick={() => setView('home')} />

      <div className="bg-stone-950 flex-grow flex justify-center items-center">
        {view === 'home' ? (
            <h1 className="text-center text-6xl text-amber-200 font-bold">
              Welcome to the Cinema
            </h1>
          ) : (
            <MovieList />
          )
        }
      </div>

      <Footer />

    </div>
  )
}

export default App