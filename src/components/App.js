import React, { useEffect, useState, useRef, useCallback } from "react";
import music from "data/music";
import Player from "./Player";
import Ensemble from "./Ensemble";
import Details from "./Details";
import List from "./List";
import Progress from "./Progress";
// import { start, check } from "utils/stopwatch";

const midi = (key) => `/midi/${key}.mid`;
const mp3 = (key) => `/mp3/${key}.mp3`;

const keys = Object.keys(music);
const DEFAULT_SONG = keys[(keys.length * Math.random()) << 0];
// const DEFAULT_SONG = "beethoven_symphony_5_1";

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
      // start();
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
        // console.log(check());
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
        <>
          <Progress {...{ audio, song, player }} />
          <Player
            {...{
              player,
              setPlayer,
              setPlaying,
              audio,
              delay: music[song].delay,
            }}
          />
        </>
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
