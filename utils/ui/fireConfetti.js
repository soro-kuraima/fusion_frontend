import confetti from "canvas-confetti";

export const useConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 10000,
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    )?.catch((err) => console.log(err));
  }

  return {
    fire,
  };
};
