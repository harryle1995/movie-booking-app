/* ------------------- IMPORTS ------------------- */
import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // 🔐 Auth context
import EditingModal from "../modals/EditingModal.jsx"; // ✏️ Modal to edit or create a movie
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import ConfirmDialog from "../modals/ConfirmDialog.jsx";// 🗑️ Reusable confirm dialog for deletions

/* ------------------- COMPONENT ------------------- */
function MovieListEditor() {
  const { user } = useContext(UserContext); // 🔐 Access logged-in admin user
  const [movies, setMovies] = useState([]); // 🎞️ Movie list fetched from backend
  const [error, setError] = useState('');
  const [editingMovie, setEditingMovie] = useState(null); // 🛠️ Current movie being edited

  // 🗑️ Deletion confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  /* ------------------- FETCH MOVIES ------------------- */
  useEffect(() => {
    if (!user?.token) return; // 🔒 Skip if not logged in

    async function fetchMovies() {
      try {
        const res = await fetch(`${API}/admin/editing`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch');
        setMovies(data); // ✅ Save to local state
      } catch (err) {
        setError(err.message || 'Failed to fetch movies');
      }
    }

    fetchMovies();
  }, [user?.token]);

  /* ------------------- SAVE MOVIE ------------------- */
  const handleSave = async (movieData) => {
    const isNew = movieData.id === null;

    try {
      const res = await fetch(
        `${API}/admin/editing${isNew ? '' : `/${movieData.id}`}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(movieData),
        }
      );

      const savedMovie = await res.json();
      if (!res.ok) throw new Error(savedMovie.message || 'Save failed');

      // 🔁 Update movie list
      setMovies((prev) =>
        isNew
          ? [...prev, savedMovie] // 🆕 Add new
          : prev.map((m) => (m.id === savedMovie.id ? savedMovie : m)) // ✏️ Update existing
      );

      toast.success('🎉 Movie saved successfully');
      setEditingMovie(null); // ✅ Close modal
    } catch (err) {
      toast.error(`❌ ${err.message || 'Save failed'}`);
    }
  };

  /* ------------------- DELETE MOVIE ------------------- */
  const requestDelete = (id) => {
    setMovieToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/admin/editing/${movieToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.status === 204) {
        // ✅ Remove from UI
        setMovies((prev) => prev.filter((m) => m.id !== movieToDelete));
        toast.success('🗑️ Movie deleted');
      } else {
        const result = await res.json();
        throw new Error(result.message || 'Delete failed');
      }
    } catch (err) {
      toast.error(`❌ ${err.message || 'Delete failed'}`);
    } finally {
      setMovieToDelete(null);
      setConfirmOpen(false);
    }
  };

  /* ------------------- RENDER ------------------- */
  return (
    <div className="p-4">
      {/* 🔎 Basic debug info */}
      <p className="text-gray-600">
        Token: {user?.token ? '✓ Present' : '✗ Missing'}
      </p>
      <p className="text-gray-600">Movies loaded: {movies.length}</p>

      {/* 🔧 Header and Add button */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Movie List Editor</h2>
        <Button
          variant="outlined"
          sx={{
            borderColor: 'green',
            color: 'green',
            '&:hover': {
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              borderColor: 'darkgreen',
            },
          }}
          onClick={() =>
            setEditingMovie({
              id: null,
              title: '',
              description: '',
              duration: '',
              genre: '',
              poster_url: '',
              showtimes: [],
            })
          }
        >
          Add a Movie
        </Button>
      </div>

      {/* 🧱 Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full max-w-[160px] mx-auto"
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-2 flex flex-col justify-between flex-1">
              <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{movie.description}</p>

              {/* ✏️ Edit / 🗑️ Delete buttons */}
              <div className="flex flex-col gap-2 mt-3">
                <button
                  className="bg-yellow-500 text-white py-2 rounded text-sm font-medium hover:bg-yellow-600"
                  onClick={() => setEditingMovie(movie)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white py-2 rounded text-sm font-medium hover:bg-red-700"
                  onClick={() => requestDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✏️ Editing Modal */}
      {editingMovie && (
        <EditingModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSave={handleSave}
          onDelete={requestDelete}
        />
      )}

      {/* 🗑️ Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Do you really want to delete this movie?"
      />
    </div>
  );
}

/* ------------------- EXPORT ------------------- */
export default MovieListEditor;
