import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faList,
  faCopyright,
} from "@fortawesome/free-solid-svg-icons";

const playStates = ["PLAYING", "RESUME", "DELAY"];

const Player = ({ player, setPlayer, setSidebar }) => {
  return (
    <div className="flex my-4 items-center justify-center text-lg">
      {!playStates.includes(player) && (
        <button
          title="PLAY"
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => {
            if (player === "STOPED") {
              setPlayer("DELAY");
            } else {
              setPlayer("RESUME");
            }
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
      )}
      {playStates.includes(player) && player !== "DELAY" && (
        <button
          title="PAUSE"
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => setPlayer("PAUSED")}
        >
          <FontAwesomeIcon icon={faPause} />
        </button>
      )}
      {player !== "STOPED" && (
        <button
          title="STOP"
          className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
          onClick={() => setPlayer("STOPED")}
        >
          <FontAwesomeIcon icon={faStop} />
        </button>
      )}
      <button
        title="PLAYLIST"
        onClick={() =>
          setSidebar((p) => (p !== "playlist" ? "playlist" : null))
        }
        className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
      >
        <FontAwesomeIcon icon={faList} />
      </button>
      <button
        title="ICONS"
        onClick={() =>
          setSidebar((a) => (a !== "attribution" ? "attribution" : null))
        }
        className="focus:outline-none appearance-none px-2 m-1 h-8 hover:text-black flex items-center justify-center text-gray-600"
      >
        <FontAwesomeIcon icon={faCopyright} />
      </button>
    </div>
  );
};

export default Player;
