import React, { useState, useEffect } from "react";
import MovieCard from "../movies/MovieCard";
import { Link } from 'react-router-dom';
// MovieList.jsx


function MovieList() {
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('http://localhost:5000/movies');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);  // empty dependency array means run once on mount

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-screen-xl">
      <h1 className="text-white mb-10 font-bold text-2xl">NOW SHOWING</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {movies.map((movie) => (
              <Link to={`/now-showing/${movie.id}`} key={movie.id}>
                <MovieCard
                  title={movie.title}
                  posterUrl={movie.poster_url}
                />
              </Link>
            ))}

        </div>
      </div>
    </div>
  );
}

export default MovieList;