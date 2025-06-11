import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import EditingModal from './EditingModal';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
// ConfirmDialog
import ConfirmDialog from './ConfirmDialog';

function MovieListEditor() {
  const { user } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [editingMovie, setEditingMovie] = useState(null);

  // ConfirmDialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    async function fetchMovies() {
      try {
        const res = await fetch('http://localhost:5000/admin/editing', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch');
        setMovies(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch movies');
      }
    }

    fetchMovies();
  }, [user?.token]);

  const handleSave = async movieData => {
    const isNew = movieData.id === null;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/editing${isNew ? '' : `/${movieData.id}`}`,
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

      setMovies(prev =>
        isNew
          ? [...prev, savedMovie]
          : prev.map(m => (m.id === savedMovie.id ? savedMovie : m))
      );

      toast.success('🎉 Movie saved successfully');
      setEditingMovie(null);
    } catch (err) {
      toast.error(`❌ ${err.message || 'Save failed'}`);
    }
  };

  // ConfirmDialog: Initiate delete with confirmation
  const requestDelete = id => {
    setMovieToDelete(id);
    setConfirmOpen(true);
  };

  // ConfirmDialog: Actual deletion after confirmation
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/editing/${movieToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.status === 204) {
        setMovies(prev => prev.filter(m => m.id !== movieToDelete));
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

  return (
    <div className="p-4">
      <p className="text-gray-600">
        Token: {user?.token ? '✓ Present' : '✗ Missing'}
      </p>
      <p className="text-gray-600">Movies loaded: {movies.length}</p>

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {movies.map(movie => (
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
              <div className="flex flex-col gap-2 mt-3">
                <button
                  className="bg-yellow-500 text-white py-2 rounded text-sm font-medium hover:bg-yellow-600"
                  onClick={() => setEditingMovie(movie)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white py-2 rounded text-sm font-medium hover:bg-red-700"
                  onClick={() => requestDelete(movie.id)} // ConfirmDialog
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingMovie && (
        <EditingModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSave={handleSave}
          onDelete={requestDelete} // ConfirmDialog
        />
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Do you really want to delete this movie?"
      />
    </div>
  );
}

export default MovieListEditor;
