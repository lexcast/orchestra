import React from "react";

const Delay = ({ song, player }) => {
  return (
    <div className="mb-4 w-64 h-px bg-transparent">
      {player === "DELAY" && (
        <div
          className="m-auto w-0 h-px bg-purple-400"
          style={{
            animation: `delay ${song.delay - 100}ms ease-in`,
            animationIterationCount: 1,
          }}
        />
      )}
    </div>
  );
};

export default Delay;
