import React from "react";

const Player = ({ canPlay, audio }) => {
  return (
    <div className="bg-yellow-100 font-sans text-center h-screen w-screen flex items-center justify-center">
      {canPlay && (
        <>
          <button
            className="focus:outline-none appearance-none p-3 bg-yellow-700 text-white font-bold"
            onClick={() => {
              window.MIDI.Player.start();
              setTimeout(() => {
                audio.current.play();
              }, 1100);
            }}
          >
            Play
          </button>
          <button
            className="focus:outline-none appearance-none p-3 bg-yellow-700 text-white font-bold"
            onClick={() => {
              window.MIDI.Player.stop();
              audio.current.pause();
              audio.current.currentTime = 0;
            }}
          >
            Stop
          </button>
        </>
      )}
    </div>
  );
};

export default Player;
