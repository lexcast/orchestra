import React from "react";
import instruments from "data/instruments";
import ensembles from "data/ensembles";

const image = (key) => `/images/instruments/${key}.png`;

const Ensemble = ({ playing }) => {
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
  );
};

export default Ensemble;
