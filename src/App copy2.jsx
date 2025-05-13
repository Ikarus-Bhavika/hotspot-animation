
// import React, { Suspense, useRef, useEffect, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";
// import * as THREE from "three";
// import "./App.css";

// function Hotspot({ target, isAnimating }) {
//   const [position, setPosition] = useState([0, 0, 0]);
//   const vec = useRef(new THREE.Vector3());

//   useFrame(() => {
//     if (target && isAnimating) {  // Log only if animation is progressing
//       console.log("Position of node:", vec.current.toArray());
//       target.getWorldPosition(vec.current);
//       setPosition([vec.current.x, vec.current.y, vec.current.z]);
//       console.log("Position of target node:", vec.current.toArray());
//     }
//   });

//   return (
//     <Html position={position} >
//       <div
//         style={{
//           backgroundColor: "rgba(255, 0, 0, 0.9)",
//           padding: "2px",
//           borderRadius: "50%",
//           cursor: "pointer",
//           width: "20px",
//           height: "20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//           fontWeight: "bold",
//         }}
//       >
//         i
//       </div>
//     </Html>
//   );
// }

// function AnimatedModel(props) {
//   const group = useRef();
//   const { scene, animations, nodes } = useGLTF("/bolt.glb");
//   const { actions } = useAnimations(animations, group);

//   const [hotspotTarget, setHotspotTarget] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const currentAction = useRef(null);
//   const originalTransforms = useRef([]);

//   const toggleAnimation = () => {
//     if (!actions || animations.length === 0) return;

//     const action = actions[animations[0].name];

//     if (!isAnimating) {
//       action.reset();
//       action.setLoop(THREE.LoopOnce);
//       action.clampWhenFinished = true;
//       action.timeScale = 1;
//       action.enabled = true;
//       action.play();
//       currentAction.current = action;
//       setIsAnimating(true);
//     } else {
//       if (currentAction.current) {
//         currentAction.current.paused = false;
//         currentAction.current.timeScale = -1;
//         currentAction.current.loop = THREE.LoopOnce;
//         currentAction.current.clampWhenFinished = true;
//         currentAction.current.onLoop = () => {
//           scene.traverse((child) => {
//             const saved = originalTransforms.current.find((t) => t.uuid === child.uuid);
//             if (saved && child.isMesh) {
//               child.position.copy(saved.position);
//               child.rotation.copy(saved.rotation);
//               child.scale.copy(saved.scale);
//             }
//           });
//           setIsAnimating(false);
//         };
//       }
//     }
//   };

//   useEffect(() => {
//     // Save original transforms
//     originalTransforms.current = [];
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         originalTransforms.current.push({
//           uuid: child.uuid,
//           position: child.position.clone(),
//           rotation: child.rotation.clone(),
//           scale: child.scale.clone(),
//         });
//       }
//     });

//     // Find target node
//     const targetNodeName = "bolt";
//     let targetNode = nodes[targetNodeName];

//     if (!targetNode) {
//       scene.traverse((child) => {
//         if (child.name === targetNodeName) {
//           targetNode = child;
//         }
//       });
//     }

//     let realTarget = null;
//     targetNode?.traverse?.((child) => {
//       if (child.isMesh && !realTarget) {
//         realTarget = child;
//       }
//     });

//     setHotspotTarget(realTarget || targetNode);
//   }, [scene, nodes]);

//   const handleClick = (e) => {
//     console.log("Clicked point:", e.point);
//   };

//   return (
//     <>
//       <group ref={group} {...props}>
//         <primitive object={scene} onClick={(e) => handleClick(e)} />
//         {hotspotTarget && (
//           <>
//             <Hotspot target={hotspotTarget} isAnimating={isAnimating} />
//             <axesHelper args={[1]} position={[0, 0, 0]} />
//           </>
//         )}
//       </group>
//       <Html>
//         <button
//           onClick={toggleAnimation}
//           style={{
//             position: "absolute",
//             top: "20px",
//             right: "20px",
//             padding: "10px 20px",
//             backgroundColor: isAnimating ? "red" : "green",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//             zIndex: 10,
//           }}
//         >
//           {isAnimating ? "Stop" : "Start"} Animation
//         </button>
//       </Html>
//     </>
//   );
// }

     


import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Html, OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function AnimatedModelWithHtmlHotspot() {
  const group = useRef();
  const hotspotRef = useRef();
  const { scene, animations } = useGLTF("/bolt.glb");
  const { actions } = useAnimations(animations, group);

  const targetRef = useRef(); // animated mesh or bone

  useEffect(() => {
    actions[Object.keys(actions)[0]]?.play(); // start animation

    // Get the mesh or bone where you want to attach the hotspot
    const target = scene.getObjectByName("bolt"); // Replace this
    targetRef.current = target;
  }, [actions, scene]);

  // Keep updating hotspot position
  useFrame(() => {
    if (targetRef.current && hotspotRef.current) {
      targetRef.current.updateWorldMatrix(true, false);
      
      const pos = new THREE.Vector3();
      console.log("pos is" ,pos);
      targetRef.current.getWorldPosition(pos);
      hotspotRef.current.position.copy(pos);
      console.log(pos);
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
      <group ref={hotspotRef}>
        <Html center>
          <div
            style={{
              background: "red",
              padding: "1px",
              borderRadius: "6px",
              color: "white",
              fontSize: "12px",
              pointerEvents: "auto",
              cursor: "pointer"
            }}
            onClick={() => alert("Hotspot clicked!")}
          >
           
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function Viewer() {
  return (
    <Canvas  camera={{ position: [0, 2, 5], fov: 50 }}  style={{ background: "white" }}>
      <ambientLight />
      <OrbitControls />
      <AnimatedModelWithHtmlHotspot />
    </Canvas>
  );
}