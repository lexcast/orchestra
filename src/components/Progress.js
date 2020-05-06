import React, { useEffect, useState } from "react";

const Progress = ({ song, audio }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audioCur = audio.current;
    const update = () => {
      setProgress((audioCur.currentTime / audioCur.duration) * 100);
    };

    if (audioCur) {
      audioCur.addEventListener("timeupdate", update);
    }

    return () => {
      if (audioCur) {
        audioCur.removeEventListener("timeupdate", update);
      }
    };
  }, [audio, song]);

  return (
    <div className="w-64 h-px bg-gray-400">
      <div className="h-px bg-black" style={{ width: progress + "%" }}></div>
    </div>
  );
};

export default Progress;
