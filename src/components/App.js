import React, { useEffect, useState, useRef, useCallback } from "react";
import musicdata from "data/music";
import composers from "data/composers";
import Player from "./Player";
import Ensemble from "./Ensemble";
import Details from "./Details";
import List from "./List";
import Progress from "./Progress";
import Delay from "./Delay";
import IconsAttribution from "./IconsAttribution";
import GithubButtons from "./GithubButtons";
import axios from "axios";
import MidiPlayer from "midi-player-js";
// import { start, check } from "utils/stopwatch";

const image = (key) => `${process.env.PUBLIC_URL}/images/composers/${key}.jpg`;

const midi = (key) => `${process.env.PUBLIC_URL}/midi/${key}.mid`;
const mp3 = (key) => `${process.env.PUBLIC_URL}/mp3/${key}.mp3`;

const loadMidi = async (url) => {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return data;
};

const music = {};
Object.entries(musicdata).forEach(([i, s]) => {
  if (s.movements) {
    Object.entries(s.movements).forEach(([j, ss]) => {
      music[i + "_" + j] = { ...s, ...ss, title: s.title + " " + ss.subtitle };
    });
  } else {
    music[i] = s;
  }
});

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
  const [sidebar, setSidebar] = useState();
  const [playing, setPlaying] = useState({});
  const [player, setPlayer] = useState("LOADING");
  const [song, setSong] = useState(DEFAULT_SONG);
  const [colored, setColored] = useState(true);
  const audio = useRef();
  const midiPlayer = useRef();
  const delay = useRef();

  const handleEnd = useCallback(() => {
    setPlayer("STOPED");
  }, []);

  useEffect(() => {
    switch (player) {
      case "LOADING":
        break;
      case "STOPED":
        clearTimeout(delay.current);
        if (midiPlayer.current) {
          midiPlayer.current.stop();
        }
        if (audio.current) {
          audio.current.removeEventListener("ended", handleEnd);
          audio.current.pause();
          audio.current.currentTime = 0;
        }
        setPlaying({});
        break;
      case "PLAYING":
        audio.current.play();
        break;
      case "RESUME":
        midiPlayer.current.play();
        audio.current.play();
        break;
      case "PAUSED":
        clearTimeout(delay.current);
        midiPlayer.current.pause();
        audio.current.pause();
        break;
      case "DELAY":
        midiPlayer.current.play();
        delay.current = setTimeout(() => {
          setPlayer("PLAYING");
        }, music[song].delay);
        break;
      default:
    }

    return () => clearTimeout(delay.current);
  }, [player, song, handleEnd]);

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
          list.forEach((n) => {
            if (trackingMap[n]) {
              trackingMap[n].push(channel);
            } else {
              trackingMap[n] = [trackingMap[n], channel];
            }
          });
        });
      }

      midiPlayer.current = new MidiPlayer.Player((event) => {
        let on;
        if ((!event.name || event.name === "Note on") && event.velocity > 0) {
          on = event.noteNumber;
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
          trackGroup.forEach((t) => (changes[t] = on));
        }

        setPlaying((playing) => ({ ...playing, ...changes }));
      });

      midiPlayer.current.loadArrayBuffer(await loadMidi(midi(songId)));
      midiPlayer.current.setTempo(music[songId].bpm);

      // start();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: music[songId].title,
          artist: composers[music[songId].composer].name,
          artwork: [
            {
              src: image(music[songId].composer),
              sizes: ["512x512"],
              type: "image/jpg",
            },
          ],
        });
      }
      if (autoplay) {
        setPlayer("DELAY");
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
    <div className="py-6 px-10 bg-yellow-100 font-cursive text-center h-screen w-screen overflow-hidden flex justify-start flex-no-wrap items-center flex-col">
      <GithubButtons />
      <Ensemble {...{ playing, song: music[song], colored }} />
      {player !== "LOADING" && (
        <div className="mt-12">
          <Delay {...{ song: music[song], player }} />
          <Progress {...{ audio, song }} />
          <Player {...{ player, setPlayer, setSidebar, setColored, colored }} />
        </div>
      )}
      <Details song={music[song]} />
      {sidebar === "playlist" && (
        <List
          {...{ song, setSidebar }}
          onClick={(songId) => {
            play(songId, true);
          }}
        />
      )}
      {sidebar === "attribution" && <IconsAttribution {...{ setSidebar }} />}
    </div>
  );
};

export default App;
