import React from "react";
import composers from "data/composers";

const image = (key) => `/images/composers/${key}.jpg`;

const Details = ({ song }) => {
  const composer = composers[song.composer];

  return (
    <div className="text-center absolute top-0 right-0 md:m-4 opacity-50 hover:opacity-100 w-full md:w-auto">
      <h1 className="text-lg font-bold">{song.title}</h1>
      <h2 className="text-base">
        {song.key} - {song.number}
      </h2>
      <p className="text-sm">
        {song.city}, {song.year}
      </p>
      <div className="w-10 h-10 m-auto">
        <img
          alt={composer.name}
          src={image(song.composer)}
          className="max-h-full max-w-full"
        />
      </div>
      <h2 className="text-base font-semibold">{composer.name}</h2>
      <p className="text-sm">
        {composer.city}, {composer.year}
      </p>
    </div>
  );
};

export default Details;
