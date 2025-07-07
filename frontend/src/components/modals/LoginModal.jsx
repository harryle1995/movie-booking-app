import React, { useState, useContext } from 'react';
// Import the UserContext to access the login function
import { UserContext } from '../contexts/UserContext.jsx';

// LoginModal component receives onClose prop to close the modal
function LoginModal({ onClose }) {
  // Access the login function from context
  const { login } = useContext(UserContext);

  // State for username and password inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for displaying login error messages
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL;

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form refresh

    try {
      // Send login credentials to backend
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // If response is not OK, throw an error
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Call login from context to save user and token
      login(data.user, data.token);

      // Close modal on successful login
      onClose();
    } catch (err) {
      // Display error message
      setError(err.message);
    }
  }

  return (
    // Modal background overlay and centering
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl text-black mb-4">Login</h2>

        {/* Display error if any */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full text-black mb-3 p-2 border border-black rounded placeholder-black"
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full text-black mb-3 p-2 border border-black rounded placeholder-black"
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {/* Cancel button to close modal */}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full text-center text-gray-600 underline"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default LoginModal;
