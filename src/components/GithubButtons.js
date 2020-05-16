import React from "react";

const GithubButtons = () => (
  <div className="fixed bottom-0 right-0 px-2 flex">
    <div className="mx-1">
      <a
        className="github-button"
        href="https://github.com/lexcast/orchestra"
        data-icon="octicon-star"
        data-size="large"
        aria-label="Star lexcast/orchestra on GitHub"
      >
        Star
      </a>
    </div>
    <div className="mx-1">
      <a
        className="github-button"
        href="https://github.com/lexcast"
        data-size="large"
        aria-label="Follow @lexcast on GitHub"
      >
        Follow @lexcast
      </a>
    </div>
  </div>
);

export default GithubButtons;
