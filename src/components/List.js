import React from "react";
import composers from "data/composers";
import music from "data/music";

const List = ({ song, onClick }) => {
  return (
    <div className="text-left relative md:absolute max-w-xl top-0 left-0 md:m-4 max-w-xl md:w-auto">
      {Object.entries(music).map(([key, { title, composer }]) => (
        <div
          key={key}
          onClick={() => onClick(key)}
          className={
            "cursor-pointer py-1" +
            (song === key ? "" : " opacity-50 hover:opacity-100")
          }
        >
          <h1 className="font-semibold text-base">{title}</h1>
          <h2 className="text-sm">{composers[composer].name}</h2>
        </div>
      ))}
    </div>
  );
};

export default List;
