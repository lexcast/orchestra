import React, { useEffect, useState, useRef, useCallback } from "react";
import music from "data/music";
import Player from "./Player";
import Ensemble from "./Ensemble";
import Details from "./Details";
import List from "./List";

const midi = (key) => `/midi/${key}.mid`;
const mp3 = (key) => `/mp3/${key}.mp3`;

const DEFAULT_SONG = "beethoven_symphony_1_2";

const App = () => {
  const [playing, setPlaying] = useState({});
  const [player, setPlayer] = useState("LOADING");
  const [song, setSong] = useState(DEFAULT_SONG);
  const audio = useRef();

  const play = useCallback((songId, autoplay) => {
    if (audio.current) {
      window.MIDI.Player.stop();
      audio.current.pause();
      audio.current.currentTime = 0;
    }
    setPlayer("LOADING");
    setPlaying({});
    setSong(songId);
    audio.current = new Audio(mp3(songId));

    window.MIDI.Player.loadFile(midi(songId), () => {
      if (autoplay) {
        window.MIDI.Player.start();
        setTimeout(() => {
          audio.current.play();
        }, music[songId].delay);
        setPlayer("PLAYING");
      } else {
        setPlayer("STOPED");
      }
    });

    window.MIDI.Player.addListener((data) => {
      if (data.message === 144) {
        setPlaying((playing) => ({
          ...playing,
          [data.track]: true,
          d: true,
        }));
      } else {
        setPlaying((playing) => ({
          ...playing,
          [data.track]: false,
          d: false,
        }));
      }
    });
  }, []);

  useEffect(() => {
    console.log("INIT");
    window.MIDI.Player.BPM = null;

    window.MIDI.loadPlugin({
      onsuccess: function () {
        for (var i = 0; i <= 15; i++) {
          window.MIDI.setVolume(i, 0);
        }
        const player = window.MIDI.Player;
        player.timeWarp = 1;

        play(DEFAULT_SONG, false);
      },
    });
  }, [play]);

  return (
    <div className="bg-yellow-100 font-cursive text-center h-screen w-screen flex items-center justify-center flex-col">
      <Ensemble {...{ playing, song: music[song] }} />
      {player !== "LOADING" && (
        <Player
          {...{
            player,
            setPlayer,
            setPlaying,
            audio,
            delay: music[song].delay,
          }}
        />
      )}
      <Details song={music[song]} />
      <List
        song={song}
        onClick={(songId) => {
          play(songId, true);
        }}
      />
    </div>
  );
};

export default App;
