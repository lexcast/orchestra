import React from "react";
import composers from "data/composers";
import music from "data/music";

const List = ({ song, onClick }) => {
  return (
    <div className="mb-6 text-left relative md:absolute max-w-xl top-0 left-0 md:m-4 max-w-xl md:w-auto">
      {Object.entries(music).map(([key, { title, composer, movements }]) => (
        <div
          key={key}
          onClick={() =>
            onClick(movements ? key + "_" + Object.keys(movements)[0] : key)
          }
          className={
            "cursor-pointer py-1" +
            (song.includes(key) ? "" : " opacity-50 hover:opacity-100")
          }
        >
          <h2 className="text-sm">{composers[composer].name}</h2>
          <h1 className="font-semibold text-base">{title}</h1>
          {movements && (
            <div className="flex items-center font-sans">
              {Object.entries(movements).map(([skey, s]) => {
                const ckey = key + "_" + skey;
                return (
                  <span
                    key={ckey}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick(ckey);
                    }}
                    className={
                      "cursor-pointer py-1 pr-2" +
                      (song === ckey ? "" : " opacity-50 hover:opacity-100")
                    }
                  >
                    {s.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default List;
