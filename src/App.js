import React, { useEffect, useReducer } from "react";
import "./App.css";
import useSound from "use-sound";
import soundFile from "./sounds/click.mp3";

// Custom hook

function useMetronome() {
  let [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "INCREMENT_SPEED":
          return { ...state, speed: state.speed + 1 };
        case "DECREMENT_SPEED":
          return { ...state, speed: state.speed - 1 };
        case "SLIDER_SPEED":
          return { ...state, speed: action.value };
        case "TOGGLE_START":
          return { ...state, isPlaying: !state.isPlaying };
        default:
          return state;
      }
    },
    {
      speed: 60,
      isPlaying: false,
    }
  );
  return [state, dispatch];
}

// Components

const Button = ({ value, action }) => {
  return (
    <button className={`button button${value}`} onClick={action}>
      {value}
    </button>
  );
};

const Slider = ({ value, action }) => {
  return (
    <input
      type="range"
      step="1"
      min="35"
      max="280"
      value={value}
      onChange={action}
    />
  );
};

// Metronome

function Metronome() {
  const [{ speed, isPlaying }, dispatch] = useMetronome();
  const [click] = useSound(soundFile);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        click();
      }, 60000 / speed);
      return () => clearInterval(interval);
    }
  }, [speed, isPlaying, click]);

  const speedUp = () => {
    dispatch({ type: "INCREMENT_SPEED" });
  };
  const speedDown = () => {
    dispatch({ type: "DECREMENT_SPEED" });
  };

  const speedSlide = (e) => {
    dispatch({ type: "SLIDER_SPEED", value: parseInt(e.target.value) || 60 });
  };

  const toggleStart = () => {
    dispatch({ type: "TOGGLE_START" });
    if (!isPlaying) {
      click();
    }
  };
  return (
    <>
      <div className="metroContainer">
        <h3 className="speedDisplay">{speed}</h3>
        <Button value="+" action={speedUp} />
        <Slider value={speed} action={speedSlide} />
        <Button value="-" action={speedDown} />
        <Button value={isPlaying ? "Stop" : "Start"} action={toggleStart} />
      </div>
      <div class="info-links">
        <p>Made by <a href="https://paologiraudi.com">Paolo</a></p>
        <p>
          Code on <a href="https://github.com/PaoloGiraudi/snake">GitHub</a>
        </p>
      </div>
    </>
  );
}

export default function App() {
  return (
    <section>
      <h1 className="mainTitle">METRONOME</h1>
      <Metronome />
    </section>
  );
}
