import React, { useEffect, useState, useRef } from "react";
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

  const play = (songId, autoplay) => {
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
        }, music[song].delay);
        setPlayer("PLAYING");
      } else {
        setPlayer("STOPED");
      }
    });

    window.MIDI.Player.addListener((data) => {
      const tracks = music[songId].tracks;
      if (data.message === 144) {
        setPlaying((playing) => ({
          ...playing,
          [tracks[data.track]]: true,
          director: true,
        }));
      } else {
        setPlaying((playing) => ({
          ...playing,
          [tracks[data.track]]: false,
          director: false,
        }));
      }
    });
  };

  useEffect(() => {
    window.MIDI.Player.BPM = null;

    window.MIDI.loadPlugin({
      onsuccess: function () {
        for (var i = 0; i <= 15; i++) {
          window.MIDI.setVolume(i, 0);
        }
        const player = window.MIDI.Player;
        player.timeWarp = 1;

        play(song, false);
      },
    });
  }, []);

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
