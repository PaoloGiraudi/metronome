import React, { useEffect, useReducer } from "react";
import useSound from "use-sound";
import click1 from "./sounds/click1.wav";

function useMetronome() {
  let [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "INCREMENT_SPEED":
          return { ...state, speed: state.speed + 1 };
        case "DECREMENT_SPEED":
          return { ...state, speed: state.speed - 1 };
        case "INPUT_SPEED":
          return { ...state, speed: action.value };
        case "TOGGLE_START":
          return { ...state, playing: !state.playing };
      }
    },
    {
      speed: 60,
      playing: false,
    }
  );
  return [state, dispatch];
}

function App() {
  let [{ speed, playing }, dispatch] = useMetronome();
  const [playOn] = useSound(click1);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        playOn();
      }, 60000 / speed);
      return () => clearInterval(interval);
    }
  }, [speed, playing]);

  const add = () => {
    dispatch({ type: "INCREMENT_SPEED" });
  };
  const substract = () => {
    dispatch({ type: "DECREMENT_SPEED" });
  };

  const typeSpeed = (e) => {
    dispatch({ type: "INPUT_SPEED", value: parseInt(e.target.value) || 60 });
  };

  const toggleStart = () => {
    dispatch({ type: "TOGGLE_START" });
    // starts immediatly
    if (!playing) {
      playOn();
    }
  };

  return (
    <section>
      <h1>Simple Metronome</h1>
      <div className="metronome">
        <button onClick={substract}> - </button>
        <input value={speed} onChange={typeSpeed} />
        <button onClick={add}> + </button>
        <input
          type="range"
          min="35"
          max="280"
          value={speed}
          step="1"
          onChange={typeSpeed}
        />
      </div>
      <button onClick={toggleStart}> {playing ? "Stop" : "Start"}</button>
    </section>
  );
}

export default App;
