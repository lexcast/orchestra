import React, { useEffect, useState, useRef } from "react";
import music from "data/music";
import Player from "./Player";
import Ensemble from "./Ensemble";
import Details from "./Details";

const midi = (key) => `/midi/${key}.mid`;
const mp3 = (key) => `/mp3/${key}.mp3`;

const songId = Object.keys(music)[0];
const song = music[songId];

const App = () => {
  const [playing, setPlaying] = useState({});
  const [player, setPlayer] = useState("LOADING");
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
        player.loadFile(midi(songId), () => setPlayer("STOPED"));

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
    <div className="bg-yellow-100 font-cursive text-center h-screen w-screen flex items-center justify-center flex-col">
      <Ensemble {...{ playing, song }} />
      {player !== "LOADING" && (
        <Player {...{ player, setPlayer, setPlaying, audio }} />
      )}
      <Details song={song} />
    </div>
  );
};

export default App;
