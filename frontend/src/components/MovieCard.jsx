// MovieCard.js
import React from "react";

function MovieCard({ title, posterUrl }) {
  return (
    <div className="flex flex-col items-center">

      <div className="overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 w-full">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-96 object-cover"
        />
      </div>

      <h3 className="mt-4 text-xl text-white font-semibold text-center">
        {title}
      </h3>
      
    </div>
  );
}

export default MovieCard;
