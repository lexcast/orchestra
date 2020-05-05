import React, { useEffect, useState } from "react";

const Progress = ({ song, player, audio }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (player === "STOPED") {
      setProgress(0);
    }

    if (audio.current) {
      audio.current.addEventListener("timeupdate", () => {
        setProgress((audio.current.currentTime / audio.current.duration) * 100);
      });
    }
  }, [audio, song, player]);

  return (
    <div className="w-64 h-px bg-gray-400">
      <div className="h-px bg-black" style={{ width: progress + "%" }}></div>
    </div>
  );
};

export default Progress;
