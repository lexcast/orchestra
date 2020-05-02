import React, { useEffect, useState, useRef } from "react";
import instruments from "data/instruments";
import ensembles from "data/ensembles";
import music from "data/music";

const image = (key) => `/images/${key}.png`;
const midi = (key) => `/midi/${key}.mid`;
const mp3 = (key) => `/mp3/${key}.mp3`;

const songId = Object.keys(music)[0];
const song = music[songId];

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState({});
  const audio = useRef();

  useEffect(() => {
    audio.current = new Audio(mp3(songId));
    window.MIDI.Player.BPM = null;

    window.MIDI.loadPlugin({
      onsuccess: function () {
        for (var i = 0; i <= 15; i++) {
          window.MIDI.setVolume(i, 0);
        }
        const player = window.MIDI.Player;
        player.timeWarp = 1;
        player.loadFile(midi(songId), () => setLoaded(true));

        player.addListener((data) => {
          if (data.message === 144) {
            setPlaying((playing) => ({
              ...playing,
              [song.tracks[data.track]]: true,
              director: true,
            }));
          } else {
            setPlaying((playing) => ({
              ...playing,
              [song.tracks[data.track]]: false,
              director: false,
            }));
          }
        });
      },
    });
  }, []);

  return (
    <div className="bg-yellow-100 font-sans text-center h-screen w-screen flex items-center justify-center flex-col">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(50, 1fr)",
          gridTemplateRows: "repeat(50, 1fr)",
          width: "600px",
          height: "600px",
        }}
      >
        {Object.keys(ensembles.orchestra).map((i) => {
          const section = ensembles.orchestra[i];
          const name = section.instrument || i;
          const instrument = instruments[name];

          return section.positions.map((p, j) => (
            <div
              key={j}
              className="flex items-center justify-center"
              style={{
                gridArea: `${p[0]} / ${p[1]} / ${p[0] + instrument[0]} / ${
                  p[1] + instrument[1]
                }`,
              }}
            >
              <img
                style={{
                  transition: "transform .1s ease",
                  transform: playing[i] ? "scale(1.2)" : "scale(1)",
                }}
                alt={name}
                className="max-w-full max-h-full"
                src={image(name)}
              />
            </div>
          ));
        })}
      </div>
      <div className="bg-yellow-100 font-sans text-center h-screen w-screen flex items-center justify-center">
        {loaded && (
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
    </div>
  );
};

export default App;
