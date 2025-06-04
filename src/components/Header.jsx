import React from "react"
// Logo effect
import { motion } from "framer-motion";
// MUI Components
import TheatersIcon from '@mui/icons-material/Theaters';
import Button from '@mui/material/Button';

function Header({ onNowShowingClick, onHomeClick }) {
    return(
        <div className="h-24 bg-rose-950 flex items-center justify-between px-4">

        <div className="flex items-center px-6">
          <motion.div
            onClick={onHomeClick}
            whileTap={{ scale: 1.2, opacity: 0.6 }}
            className="cursor-pointer transition duration-300 hover:drop-shadow-[0_0_6px_white]"
          >
            <TheatersIcon sx={{ fontSize: 96, color: '#fde68a' }} />
          </motion.div>
          <Button
            variant="text"
            sx={{ color: '#fde68a', ml: 4 }}
            onClick={onNowShowingClick}
          >
            NOW SHOWING
          </Button>

          <Button
            variant="text"
            sx={{ color: '#fde68a', ml: 3 }}
          >
            UPCOMING
          </Button>
        </div>

        <div className="flex gap-x-4">
          <Button
            variant="outlined"
            sx={{
              color: '#fde68a',          // Tailwind amber-200 hex
              borderColor: '#fde68a',    // Outline color
              '&:hover': {
                borderColor: '#fcd34d',  // Optional: darker on hover
                backgroundColor: 'rgba(252, 211, 77, 0.08)', // soft amber background on hover
              }
            }}>
              Login
          </Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#fde68a', color: 'black' }}  // optional: make text readable
          >
            Register
          </Button>
        </div>

      </div>
    )
}

export default Header