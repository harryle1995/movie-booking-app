import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // 🔸 Global styles
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // 🔸 Enables routing across pages
import { UserProvider } from './components/contexts/UserContext.jsx'; // 🔸 Provides global user state (auth)

// 🔹 Mount the React app to the #root element in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔄 Enables clean routing with browser history */}
    <BrowserRouter>
      {/* 🔐 Provides authentication context (user, login, logout) globally */}
      <UserProvider>
        {/* 🧠 Main app UI and routing logic */}
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
