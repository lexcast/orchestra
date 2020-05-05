let startTime;

const start = () => {
  startTime = new Date();
};

const check = () => {
  const endTime = new Date();

  return endTime - startTime;
};

export { start, check };
