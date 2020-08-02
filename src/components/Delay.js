import React from "react";

const Delay = ({ song }) => {
  return (
    <div className="mb-4 w-64 h-px bg-transparent">
      <div
        className="m-auto w-0 h-px bg-purple-400"
        style={{
          animation: `delay ${song.delay - 100}ms ease-in`,
          animationIterationCount: 1,
        }}
      />
    </div>
  );
};

export default Delay;
