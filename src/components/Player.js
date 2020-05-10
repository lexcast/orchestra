import React from "react";

const Player = ({
  player,
  midiPlayer,
  audio,
  setPlayer,
  setPlaying,
  delay,
}) => {
  return (
    <div className="flex my-4 items-center justify-center text-lg">
      {player !== "PLAYING" && (
        <button
          title="Play"
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => {
            if (player === "STOPED") {
              midiPlayer.current.play();
              setTimeout(() => {
                audio.current.play();
              }, delay);
            } else {
              midiPlayer.current.play();
              audio.current.play();
            }
            setPlayer("PLAYING");
          }}
        >
          Play
        </button>
      )}
      {player === "PLAYING" && (
        <button
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => {
            midiPlayer.current.pause();
            audio.current.pause();
            setPlayer("PAUSED");
          }}
        >
          Pause
        </button>
      )}
      {player !== "STOPED" && (
        <button
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => {
            midiPlayer.current.stop();
            audio.current.pause();
            audio.current.currentTime = 0;
            setPlaying({});
            setPlayer("STOPED");
          }}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default Player;
