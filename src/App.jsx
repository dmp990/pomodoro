import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";

import Clock from "./Clock";
import Minutes from "./components/Minutes/Minutes";
import Seconds from "./components/Seconds/Seconds";

import styles from "./App.module.css";

import audioFile from "/service-bell-impatient-dinging-jam-fx-2-2-00-04.mp3";

export const TimeLeftContext = React.createContext();

function TomatoModel({ timeLeft }) {
  const { scene } = useGLTF("/untitled.glb");

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const meshRef = useRef();

  const props = useSpring({
    scale: clicked ? [1.7, 1.7, 1.7] : hovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
  });

  return (
    <a.mesh
      ref={meshRef}
      scale={props.scale}
      onPointerOver={(event) => setHovered(true)}
      onPointerOut={(event) => setHovered(false)}
      onClick={(event) => setClicked(!clicked)}
    >
      <primitive object={scene} />
      <Clock timeLeft={timeLeft} />
    </a.mesh>
  );
}

function App() {
  const [timeLeft, setTimeLeft] = useState(60 * 25); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    //console.log(`Running: ${isRunning}, timeLeft: ${timeLeft}`);
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // take 1 away
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      jingleBell();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1500); // Reset to 25 minutes
  };

  const jingleBell = () => {
    audioRef.current.play();
  };

  return (
    <TimeLeftContext.Provider value={timeLeft}>
      <div className={styles.buttonsContainer}>
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
  );
}

export default App;
