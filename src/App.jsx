import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Minutes from "./components/Minutes/Minutes";
import Seconds from "./components/Seconds/Seconds";
import TomatoModel from "./components/TomatoModel/TomatoModel";

import styles from "./App.module.css";

import audioFile from "/service-bell-impatient-dinging-jam-fx-2-2-00-04.mp3";
import { TimeLeftContext, InitialTimeContext } from "./context/TimerContext";

function App() {
  const [inputMinutes, setInputMinutes] = useState(25);
  const [initialTime, setInitialTime] = useState(60 * 25);
  const [timeLeft, setTimeLeft] = useState(60 * 25); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          audioRef.current?.play();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    document.title = `🍅 ${minutes}:${seconds} — Pomodoro`;
  }, [timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleMinutesChange = (e) => {
    const mins = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
    setInputMinutes(mins);
    const secs = mins * 60;
    setInitialTime(secs);
    setTimeLeft(secs);
    setIsRunning(false);
  };

  return (
    <InitialTimeContext.Provider value={initialTime}>
      <TimeLeftContext.Provider value={timeLeft}>
        <div className={styles.buttonsContainer}>
          <input
            type="number"
            min="1"
            max="60"
            value={inputMinutes}
            onChange={handleMinutesChange}
            disabled={isRunning}
            className={styles.btn}
            style={{ width: "4rem" }}
            title="Set duration in minutes"
          />
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className={styles.btn}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer} className={styles.btn}>
            Reset
          </button>
          <audio ref={audioRef} src={audioFile} />
        </div>

        {/*<div className={styles.minutesContainer}>{Math.floor(timeLeft / 60)}</div>*/}
        {/*<div className={styles.secondsContainer}>{timeLeft % 60}</div>*/}
        <Canvas>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} />
          <OrbitControls />
          <TomatoModel timeLeft={timeLeft} />
          <Minutes />
          <Seconds />
        </Canvas>
      </TimeLeftContext.Provider>
    </InitialTimeContext.Provider>
  );
}

export default App;
