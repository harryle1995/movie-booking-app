import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TheatersIcon from "@mui/icons-material/Theaters";
import Button from "@mui/material/Button";
import { UserContext } from "../contexts/UserContext.jsx";
import RegisterModal from "./RegisterModal.jsx";
import LoginModal from "./LoginModal.jsx";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="h-24 bg-rose-950 flex items-center justify-between px-4">
      {/* Left Logo + Navigation */}
      <div className="flex items-center px-6">
        <motion.div
          onClick={() => navigate("/")}
          whileTap={{ scale: 1.2, opacity: 0.6 }}
          className="cursor-pointer transition duration-300 hover:drop-shadow-[0_0_6px_white]"
        >
          <TheatersIcon sx={{ fontSize: 96, color: "#FEF08A" }} />
        </motion.div>

        <Button
          variant="text"
          sx={{ color: "#FEF08A", ml: 4 }}
          onClick={() => navigate("/now-showing")}
        >
          NOW SHOWING
        </Button>

        <Button variant="text" sx={{ color: "#FEF08A", ml: 3 }}>
          UPCOMING
        </Button>

        {user?.is_admin && (
          <Button
            variant="contained"
            sx={{
              ml: 3,
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: '#056e3f',
              },
            }}
            onClick={() => navigate('/admin/editing')}
          >
            Editing Movie List
          </Button>
)}
      </div>

      {/* Right Auth Buttons */}
      <div className="flex gap-x-4 items-center">
        {user ? (
          <>
            <span className="text-amber-200 text-sm">Hi, {user.username}</span>

            {user.is_admin ? (
              <>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#FEF08A",
                    borderColor: "#FEF08A",
                    "&:hover": {
                      borderColor: "#fcd34d",
                      backgroundColor: "rgba(252, 211, 77, 0.08)",
                    },
                  }}
                  onClick={() => navigate("/admin/bookings")}
                >
                  Manage Bookings
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  color: "#FEF08A",
                  borderColor: "#FEF08A",
                  "&:hover": {
                    borderColor: "#fcd34d",
                    backgroundColor: "rgba(252, 211, 77, 0.08)",
                  },
                }}
                onClick={() => navigate("/my-bookings")}
              >
                My Bookings
              </Button>
            )}

            <Button
              variant="contained"
              sx={{ backgroundColor: "#fde68a", color: "black" }}
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              sx={{
                color: "#FEF08A",
                borderColor: "#FEF08A",
                "&:hover": {
                  borderColor: "#fcd34d",
                  backgroundColor: "rgba(252, 211, 77, 0.08)",
                },
              }}
              onClick={() => setShowLogin(true)}
            >
              Login
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#fde68a", color: "black" }}
              onClick={() => setShowRegister(true)}
            >
              Register
            </Button>
          </>
        )}
      </div>

      {/* Show Modals */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Header;
