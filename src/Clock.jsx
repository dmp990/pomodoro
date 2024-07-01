import React, { useRef, useEffect } from "react";

function ClockFace() {
  return (
    <mesh>
      <cylinderGeometry args={[0.6, 0.6, 0.02, 64]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function ClockHand({ length, thickness, color }) {
  return (
    <mesh position={[0, length / 2, -0.1]}>
      <boxGeometry args={[thickness, length, 0.02]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function Clock({ timeLeft }) {
  // const hourHandRef = useRef();
  const minuteHandRef = useRef();
  const secondHandRef = useRef();

  /*
  useFrame(() => {
    if (!running) {
      return;
    }

    const date = new Date();
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    //console.log(`${hours}:${minutes}:${seconds}`);

    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = seconds * (Math.PI / 30);
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z =
        -minutes * (Math.PI / 30) - (seconds / 60) * (Math.PI / 30);
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z =
        -hours * (Math.PI / 6) - (minutes / 60) * (Math.PI / 6);
    }
  });
  */
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (minuteHandRef.current) {
      const initialPos = (-5 * Math.PI) / 30;
      minuteHandRef.current.rotation.z =
        initialPos - ((25 - minutes) * Math.PI) / 30;
    }
    if (secondHandRef.current) {
      const initialPos = Math.PI;
      secondHandRef.current.rotation.z = initialPos + seconds * (Math.PI / 30);
    }
  }, [timeLeft]);

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
      <ClockFace />
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/**
         <group ref={hourHandRef} position={[0, 0, -0.01]}>
          <ClockHand length={0.3} thickness={0.05} color="black" />
        </group> */}
        <group ref={minuteHandRef} position={[0, 0, -0.015]}>
          <ClockHand length={0.45} thickness={0.03} color="blue" />
        </group>
        <group ref={secondHandRef} position={[0, 0, -0.02]}>
          <ClockHand length={0.5} thickness={0.01} color="red" />
        </group>
        {/**<group position={[0, 0, -0.5]}>
          <ClockHand length={0.1} thickness={0.01} color={"white"} />
          <group rotation={[0, 0, Math.PI / 2]} position={[0, 0, -0.1]}>
            <ClockHand length={0.1} thickness={0.01} color={"white"} />
          </group>
        </group> */}
      </group>
    </group>
  );
}
