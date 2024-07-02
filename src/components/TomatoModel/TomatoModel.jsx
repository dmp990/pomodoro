import { useSpring, a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import React from "react";
import Clock from "../Clock/Clock";

const TomatoModel = () => {
  const { scene } = useGLTF("/untitled.glb");

  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);

  const meshRef = React.useRef();

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
      <Clock />
    </a.mesh>
  );
};

export default TomatoModel;
