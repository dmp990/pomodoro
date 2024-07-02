import React from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { useLoader, extend } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";

import { TimeLeftContext } from "../../App";

extend({ TextGeometry });

const Minutes = () => {
  const timeLeft = React.useContext(TimeLeftContext);

  const font = useLoader(
    FontLoader,
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
  );

  const texture = useLoader(TextureLoader, "/8.png");
  texture.colorSpace = SRGBColorSpace;

  const textOptions = {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  return (
    <mesh position={[-2, 0, 1]}>
      <textGeometry
        attach="geometry"
        args={[Math.floor(timeLeft / 60).toString(), textOptions]}
      />
      <meshMatcapMaterial matcap={texture} />
    </mesh>
  );
};

export default Minutes;
