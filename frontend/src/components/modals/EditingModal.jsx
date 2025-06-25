import React, { useState, useEffect } from 'react';
import ConfirmDialog from "./ConfirmDialog.jsx";;

function EditingModal({ movie, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ ...movie });
  const [confirmOpen, setConfirmOpen] = useState(false); // NEW: confirm dialog state

  useEffect(() => {
    setForm({ ...movie });
  }, [movie]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSaveClick() {
    setConfirmOpen(true); // Show confirm dialog instead of saving immediately
  }

  function handleConfirmSave() {
    onSave(form); // parent decides POST or PUT
    onClose();
    setConfirmOpen(false);
  }

  function handleDelete() {
    const confirm = window.confirm('Are you sure you want to delete this item?');
    if (!confirm) return;
    onDelete(form.id); // parent handles DELETE
    onClose();
  }

  return (
    <>
      {/* Modal UI */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl space-y-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {movie.id ? 'Edit Movie' : 'Add New Movie'}
          </h2>

          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Poster URL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Poster URL</label>
            <input
              name="poster_url"
              value={form.poster_url}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Genre</label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="number"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded resize-none overflow-hidden"
              rows={1}
              onFocus={(e) => (e.target.rows = 6)}
              onBlur={(e) => (e.target.rows = 1)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            {movie.id && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            )}
            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick} // trigger confirm
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ConfirmDialog for Save */}
      <ConfirmDialog
        isOpen={confirmOpen}
        message="Save changes to this movie?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  );
}

export default EditingModal;
