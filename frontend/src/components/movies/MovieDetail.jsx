import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext.jsx';
import LoginModal from '../modals/LoginModal';
import { useNavigate } from 'react-router-dom';

function MovieDetail() {
  const { id, showtimeId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [editMovie, setEditMovie] = useState({});
  const [editing, setEditing] = useState(false);

  function handleShowtimeClick(showtimeId) {
    if (!user) {
      setShowLogin(true);
    } else {
      // Navigate to booking page for the showtime
      navigate(`/now-showing/${id}/${showtimeId}`);
    }
  }

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`http://localhost:5000/movies/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const data = await res.json();
  
        // Set movie info
        setMovie({
          id: data.id,
          title: data.title,
          duration: data.duration,
          description: data.description,
          poster_url: data.poster_url,
          genre: data.genre,
        });
  
        // Process showtimes (already included in `data`)
        const grouped = {};
        const today = new Date();
        const next4Days = Array.from({ length: 4 }, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          return d.toDateString();
        });
  
        data.showtimes.forEach(show => {
          const dateStr = new Date(show.start_time).toDateString();
          if (next4Days.includes(dateStr)) {
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(show);
          }
        });
  
        setShowtimes(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Poster */}
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full rounded-xl shadow-lg"
        />

        {/* Movie Info*/ }
        <div className="pl-8">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="mb-3"><strong>Duration:</strong> {movie.duration} minutes</p>
          <p className="mb-3"><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Description:</strong></p>
          <p className="mt-1 text-gray-300">{movie.description}</p>

          {/* Showtimes */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Showtimes</h2>
            {Object.entries(showtimes).map(([date, shows], index, arr) => (
              <div key={date} className="mb-6">
                <p className="font-medium text-gray-300 mb-2">{date}</p>
                <div className="flex flex-wrap gap-2">
                  {shows.map(show => {
                    const time = new Date(show.start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    return (
                      <button
                        key={show.id}
                        onClick={() => handleShowtimeClick(show.id)}
                        className="inline-block px-4 py-2 text-black bg-white hover:bg-yellow-200 rounded transition"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {index < arr.length - 1 && <hr className="my-4 border-gray-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default MovieDetail;
