import React from 'react'
import TheatersIcon from '@mui/icons-material/Theaters';
import Button from '@mui/material/Button';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <div className="h-24 bg-rose-950 flex items-center justify-between px-4">
      <div className="flex items-center px-6">
        <TheatersIcon sx={{ fontSize: 96, color: '#fde68a' }} />

        <Button
          variant="text"
          sx={{ color: '#fde68a', ml: 4 }}
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

      <div className="bg-stone-950 flex-grow flex justify-center items-center">
        <h1 className="text-center text-6xl text-amber-200 font-bold">
          Welcome to the theater
        </h1>
      </div>
      <div className="h-10 bg-rose-950 flex text-amber-200 items-center justify-center">
        Copyright
      </div>

    </div>
  )
}

export default App