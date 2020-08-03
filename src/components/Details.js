import React, { useEffect, useState } from "react";
import composers from "data/composers";

const image = (key) => `${process.env.PUBLIC_URL}/images/composers/${key}.jpg`;

const Details = ({ song }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(step === 4 ? 1 : step + 1);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [step, setStep]);

  const composer = composers[song.composer];

  return (
    <div className="bg-yellow-100 flex w-64 h-16 rounded-lg overflow-hidden mb-6 relative md:absolute bottom-0 left-0 md:m-4 opacity-75 hover:opacity-100 hover:shadow-lg">
      <div
        className="w-16 flex-shrink-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url("${image(song.composer)}")` }}
      />
      <div className="relative flex-1 text-left">
        <div
          className={
            "absolute top-0 left-0 m-2 duration-500 ease-in-out transition-opacity " +
            (step === 1 ? "opacity-100" : "opacity-0")
          }
        >
          <h1 className="text-base font-bold">{song.title}</h1>
        </div>
        <div
          className={
            "absolute top-0 left-0 m-2 duration-500 ease-in-out transition-opacity " +
            (step === 2 ? "opacity-100" : "opacity-0")
          }
        >
          <h2 className="text-sm">
            {song.key} - {song.number}
          </h2>
          <p className="text-sm">
            {song.city}, {song.year}
          </p>
        </div>
        <div
          className={
            "absolute top-0 left-0 m-2 duration-500 ease-in-out transition-opacity " +
            (step === 3 ? "opacity-100" : "opacity-0")
          }
        >
          <h2 className="text-base font-semibold">{composer.name}</h2>
          <p className="text-sm">
            {composer.city}, {composer.year}
          </p>
        </div>
        <div
          className={
            "absolute top-0 left-0 m-2 duration-500 ease-in-out transition-opacity " +
            (step === 4 ? "opacity-100" : "opacity-0 pointer-events-none")
          }
        >
          <p className="text-sm">
            MIDI by{" "}
            <a
              className="text-purple-600 font-bold hover:text-purple-700"
              href={song.midi_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {song.midi_author}
            </a>
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default Details;
