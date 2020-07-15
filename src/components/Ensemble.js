import React from "react";
import instruments from "data/instruments";
import ensembles from "data/ensembles";

const image = (key) =>
  `${process.env.PUBLIC_URL}/images/instruments/${key}.svg`;

const Ensemble = ({ song, playing }) => {
  const ensemble = ensembles[song.ensemble];

  return (
    <div
      className="md:p-10 lg:p-20 lg:-mt-10"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(50, 1fr)",
        gridTemplateRows: "repeat(35, 1fr)",
        width: "80vw",
        height: "56vw",
      }}
    >
      {Object.entries(song.tracks).map(([inst, track]) => {
        const [i, p] = inst.split("|");
        const section = ensemble[i];
        const name = section.instrument || i;
        const instrument = instruments[name];
        const pos = p ? p.split(",") : false;

        return section.positions.map((p, j) => {
          if (pos && !pos.includes(j.toString())) {
            return null;
          }

          return (
            <div
              key={i + j}
              className="flex items-center justify-center"
              style={{
                gridArea: `${p[0]} / ${p[1]} / ${p[0] + instrument[0]} / ${
                  p[1] + instrument[1]
                }`,
              }}
            >
              <img
                style={{
                  transition: "transform .05s ease",
                  transform: playing[track] ? "scale(1.2)" : "scale(1)",
                }}
                alt={name}
                className="max-w-full max-h-full"
                src={image(name)}
              />
            </div>
          );
        });
      })}
    </div>
  );
};

export default Ensemble;
