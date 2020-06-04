import React, { useEffect, useState, useRef, useCallback } from "react";
import music from "data/music";
import Player from "./Player";
import Ensemble from "./Ensemble";
import Details from "./Details";
import List from "./List";
import Progress from "./Progress";
import IconsAttribution from "./IconsAttribution";
import GithubButtons from "./GithubButtons";
import axios from "axios";
import MidiPlayer from "midi-player-js";
// import { start, check } from "utils/stopwatch";

const midi = (key) => `${process.env.PUBLIC_URL}/midi/${key}.mid`;
const mp3 = (key) => `${process.env.PUBLIC_URL}/mp3/${key}.mp3`;

const loadMidi = async (url) => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return data;
};

const keys = Object.keys(music);
let DEFAULT_SONG = "";
if (window.location.href.includes("#")) {
  const songKey = window.location.href.split("#")[1];
  if (keys.includes(songKey)) {
    DEFAULT_SONG = songKey;
  }
}

if (!DEFAULT_SONG) {
  DEFAULT_SONG = keys[(keys.length * Math.random()) << 0];
}

const App = () => {
  const [playing, setPlaying] = useState({});
  const [player, setPlayer] = useState("LOADING");
  const [song, setSong] = useState(DEFAULT_SONG);
  const audio = useRef();
  const midiPlayer = useRef();

  const handleEnd = useCallback(() => {
    setPlayer("STOPED");
  }, []);

  const play = useCallback(
    async (songId, autoplay) => {
      if (midiPlayer.current) {
        midiPlayer.current.stop();
      }
      if (audio.current) {
        audio.current.removeEventListener("ended", handleEnd);
        audio.current.pause();
        audio.current.currentTime = 0;
      }
      setPlayer("LOADING");
      setPlaying({});
      setSong(songId);
      audio.current = new Audio(mp3(songId));
      audio.current.addEventListener("ended", handleEnd);

      const trackingMap = {};
      const byNote = music[songId].trackNotes;
      if (byNote) {
        Object.entries(byNote).forEach(([track, groups]) => {
          Object.entries(groups).forEach(([g, notes]) => {
            notes.forEach((n) => (trackingMap[`${track}.${n}`] = g));
          });
        });
      }
      const byGroups = music[songId].groupTracks;
      if (byGroups) {
        Object.entries(byGroups).forEach(([channel, list]) => {
          list.forEach((n) => (trackingMap[n] = channel));
        });
      }

      midiPlayer.current = new MidiPlayer.Player((event) => {
        let on;
        if ((!event.name || event.name === "Note on") && event.velocity > 0) {
          on = true;
        } else if (
          event.name === "Note off" ||
          ((!event.name || event.name === "Note on") && event.velocity === 0)
        ) {
          on = false;
        } else {
          return;
        }
        // console.log(check());
        const changes = { [event.track - 1]: on, d: on };

        const trackNote = trackingMap[`${event.track - 1}.${event.noteNumber}`];
        if (trackNote) {
          changes[trackNote] = on;
        }

        const trackGroup = trackingMap[event.track - 1];
        if (trackGroup) {
          changes[trackGroup] = on;
        }

        setPlaying((playing) => ({ ...playing, ...changes }));
      });

      midiPlayer.current.loadArrayBuffer(await loadMidi(midi(songId)));
      midiPlayer.current.setTempo(music[songId].bpm);

      // start();
      if (autoplay) {
        midiPlayer.current.play();
        setTimeout(() => {
          audio.current.play();
        }, music[songId].delay);
        setPlayer("PLAYING");
      } else {
        setPlayer("STOPED");
      }
    },
    [handleEnd]
  );

  useEffect(() => {
    play(DEFAULT_SONG, false);

    return () => {
      if (audio.current) {
        audio.current.removeEventListener("ended", handleEnd);
        audio.current.pause();
      }
      if (midiPlayer.current) {
        midiPlayer.current.stop();
      }
    };
  }, [play, handleEnd]);

  return (
    <div className="bg-yellow-100 font-cursive text-center min-h-screen w-screen flex items-center justify-center flex-col">
      <GithubButtons />
      <Ensemble {...{ playing, song: music[song] }} />
      {player !== "LOADING" && (
        <>
          <Progress {...{ audio, song }} />
          <Player
            {...{ player, midiPlayer, setPlayer, setPlaying, audio }}
            delay={music[song].delay}
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
      <IconsAttribution />
    </div>
  );
};

export default App;
