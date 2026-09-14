import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Minutes from "./components/Minutes/Minutes";
import Seconds from "./components/Seconds/Seconds";
import TomatoModel from "./components/TomatoModel/TomatoModel";

import { Analytics } from "@vercel/analytics/react";
import styles from "./App.module.css";

import audioFile from "/service-bell-impatient-dinging-jam-fx-2-2-00-04.mp3";
import { TimeLeftContext, InitialTimeContext } from "./context/TimerContext";

const DEFAULT_MINUTES = 25;

function App() {
  const [inputMinutes, setInputMinutes] = useState(() => {
    const saved = localStorage.getItem("pomodoro_default_minutes");
    const parsed = parseInt(saved, 10);
    return !isNaN(parsed) && parsed >= 1 && parsed <= 60
      ? parsed
      : DEFAULT_MINUTES;
  });
  const [initialTime, setInitialTime] = useState(() => inputMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(() => inputMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);
  const targetEndTimeRef = useRef(null);
  const pendingStartTimeRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    // Compute the target end time from the pending start
    if (pendingStartTimeRef.current !== null) {
      targetEndTimeRef.current =
        Date.now() + pendingStartTimeRef.current * 1000;
      pendingStartTimeRef.current = null;
    }

    const tick = () => {
      if (!targetEndTimeRef.current) return;
      const remaining = Math.max(
        0,
        Math.ceil((targetEndTimeRef.current - Date.now()) / 1000),
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        targetEndTimeRef.current = null;
        audioRef.current?.play();
        // Browser notification (works even when tab is hidden)
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🍅 Pomodoro Complete!", {
            body: "Time's up — take a break!",
            icon: "/tomato.png",
          });
        }
      }
    };

    const timer = setInterval(tick, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    document.title = `🍅 ${minutes}:${seconds} — Pomodoro`;
  }, [timeLeft]);

  // Request notification permission on first user interaction
  const requestNotificationPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timeLeft <= 0) return;
    requestNotificationPermission();
    pendingStartTimeRef.current = timeLeft;
    setIsRunning(true);
  }, [timeLeft, requestNotificationPermission]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setTimeLeft(initialTime);
  }, [initialTime]);

  const handleMinutesChange = (e) => {
    const mins = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
    setInputMinutes(mins);
    localStorage.setItem("pomodoro_default_minutes", mins.toString());
    const secs = mins * 60;
    setInitialTime(secs);
    setTimeLeft(secs);
    setIsRunning(false);
    targetEndTimeRef.current = null;
  };

  const PRESETS = [15, 25, 35, 45, 60];

  const setPreset = (mins) => {
    setInputMinutes(mins);
    localStorage.setItem("pomodoro_default_minutes", mins.toString());
    const secs = mins * 60;
    setInitialTime(secs);
    setTimeLeft(secs);
    setIsRunning(false);
    targetEndTimeRef.current = null;
  };

  // Keyboard shortcuts: Space = start/pause, R = reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "button") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      } else if (e.code === "KeyR") {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, startTimer, pauseTimer, resetTimer]);

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
        <div className={styles.presetsContainer}>
          {PRESETS.map((mins) => (
            <button
              key={mins}
              onClick={() => setPreset(mins)}
              disabled={isRunning}
              className={`${styles.presetBtn} ${inputMinutes === mins ? styles.presetBtnActive : ""}`}
            >
              {mins}m
            </button>
          ))}
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
      <Analytics />
    </InitialTimeContext.Provider>
  );
}

export default App;
