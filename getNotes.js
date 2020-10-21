const music = require("./my.json");

const track = music.tracks.find((t) => t.id === 8);

const notes = {};

track.notes.forEach((n) => (notes[n.midi] = n.midi));

console.log(notes);
