import React from "react";
import { TimeLeftContext } from "../../App";

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

const Clock = () => {
  const timeLeft = React.useContext(TimeLeftContext);

  const minuteHandRef = React.useRef();
  const secondHandRef = React.useRef();

  React.useEffect(() => {
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
        <group ref={minuteHandRef} position={[0, 0, -0.015]}>
          <ClockHand length={0.45} thickness={0.03} color="blue" />
        </group>
        <group ref={secondHandRef} position={[0, 0, -0.02]}>
          <ClockHand length={0.5} thickness={0.01} color="red" />
        </group>
      </group>
    </group>
  );
};

export default Clock;
