import React, { useEffect, useRef } from "react";
import composers from "data/composers";
import music from "data/music";

const List = ({ song, onClick, setSidebar }) => {
  const el = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      e.stopPropagation();

      if (el.current && !el.current.contains(e.target)) {
        setSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [setSidebar]);

  return (
    <div
      ref={el}
      className="h-full overflow-y-auto bg-yellow-50 shadow-lg text-left absolute top-0 left-0 w-64"
    >
      {Object.entries(music).map(([key, { title, composer, movements }]) => (
        <div
          key={key}
          onClick={() => {
            onClick(movements ? key + "_" + Object.keys(movements)[0] : key);
            setSidebar();
          }}
          className={
            "cursor-pointer px-4 py-2 " +
            (song.includes(key)
              ? "border-l-4 border-purple-500 bg-purple-100"
              : "opacity-50 hover:opacity-100")
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
                      setSidebar();
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
