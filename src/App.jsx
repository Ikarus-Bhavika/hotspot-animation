import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

function Hotspot({ target }) {
  const [position, setPosition] = useState(null);

  useFrame(() => {
    if (target) {
      target.updateMatrixWorld(true);
      const pos = new THREE.Vector3();
      target.getWorldPosition(pos);
      console.log('World Position:', pos);
      setPosition(pos.toArray());
    }
  });

  if (!position) return null;

  return (
    <Html position={position}>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2px',
          borderRadius: '50%',
          cursor: 'pointer',
          width: '10px',
          height: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        i
      </div>
    </Html>
  );
}

function AnimatedModel(props) {
  const group = useRef();
  const { scene, animations, nodes } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
  const { actions } = useAnimations(animations, group);

  // State to track the specific node for hotspot and animation
  const [hotspotTarget, setHotspotTarget] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentAction = useRef(null);
  const originalTransforms = useRef([]);

  const toggleAnimation = () => {
    if (!actions || animations.length === 0) return;

    const action = actions[animations[0].name];

    if (!isAnimating) {
      // Start animation forward
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.timeScale = 1; // Forward animation
      action.enabled = true;
      action.play();
      currentAction.current = action;
      setIsAnimating(true);
    } else {
      // Reverse animation
      if (currentAction.current) {
        currentAction.current.paused = false;
        currentAction.current.timeScale = -1; // Reverse animation

        // Wait for the reverse animation to complete
        currentAction.current.clampWhenFinished = true;
        currentAction.current.loop = THREE.LoopOnce;

        // When reverse animation finishes, reset to original state
        currentAction.current.clampWhenFinished = true;
        currentAction.current.onLoop = () => {
          // Restore original transforms when reverse animation completes
          scene.traverse((child) => {
            const savedTransform = originalTransforms.current.find(t => t.uuid === child.uuid);
            if (savedTransform && child.isMesh) {
              child.position.copy(savedTransform.position);
              child.rotation.copy(savedTransform.rotation);
              child.scale.copy(savedTransform.scale);
            }
          });
          setIsAnimating(false);
        };
      }
    }
  };

  useEffect(() => {
    // Store original transformations
    originalTransforms.current = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        originalTransforms.current.push({
          uuid: child.uuid,
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone()
        });
      }
    });

    // Find the node you want to track for the hotspot
  //   const targetNode = nodes['Fergo_Valve003'];
  //   console.log('Target Node:', targetNode);
  //   setHotspotTarget(targetNode);
  // }, [scene, nodes]);
  const targetNode = nodes['Fergo_Valve003'];
  let realTarget = null;

  targetNode?.traverse?.((child) => {
    if (child.isMesh && !realTarget) {
      realTarget = child;
    }
  });

  setHotspotTarget(realTarget || targetNode);
}, [nodes]);

  const handleClick = (e) => {
    // e.preventDefault();
    console.log(e.point);
  }

  return (
    <>
      <group ref={group} {...props}>
        <primitive object={scene}  onClick={(e)=>handleClick(e)}/>
        {hotspotTarget && <Hotspot target={hotspotTarget} />}
      </group>
      <Html>
        <button
          onClick={toggleAnimation}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: isAnimating ? 'red' : 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          {isAnimating ? 'Stop' : 'Start'} Animation

        </button>

      </Html>
    </>
  );
}

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas
        className="canvas"
        camera={{ position: [0, -3, -3], fov: 50 }}
        style={{ width: '100%', height: '100%', }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Suspense fallback={null}>
          <AnimatedModel scale={5} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;

// import React, { Suspense, useRef, useEffect, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";
// import * as THREE from "three";
// import "./App.css";

// function Hotspot({ target }) {
//   const [position, setPosition] = useState(null);
//   const hotspotRef = useRef();

//   useEffect(() => {
//     if (target) {
//       console.log("Target object:", target);

//       // Attempt multiple ways to get world position
//       const pos = new THREE.Vector3();

//       // Method 1: getWorldPosition
//       target.getWorldPosition(pos);
//       console.log(
//         "Method 1 - World Position (getWorldPosition):",
//         pos.toArray()
//       );

//       // Method 2: updateMatrixWorld and then getWorldPosition
//       target.updateMatrixWorld(true);
//       target.getWorldPosition(pos);
//       console.log(
//         "Method 2 - World Position (after updateMatrixWorld):",
//         pos.toArray()
//       );

//       // Method 3: Use matrix world position
//       pos.setFromMatrixPosition(target.matrixWorld);
//       console.log("Method 3 - World Position (from matrix):", pos.toArray());

//       setPosition(pos.toArray());
//     }
//   }, [target]);

//   if (!position) return null;

//   return (
//     <Html position={position}>
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

//   // State to track the specific node for hotspot and animation
//   const [hotspotTarget, setHotspotTarget] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const currentAction = useRef(null);
//   const originalTransforms = useRef([]);

//   const toggleAnimation = () => {
//     if (!actions || animations.length === 0) return;

//     const action = actions[animations[0].name];

//     if (!isAnimating) {
//       // Start animation forward
//       action.reset();
//       action.setLoop(THREE.LoopOnce);
//       action.clampWhenFinished = true;
//       action.timeScale = 1; // Forward animation
//       action.enabled = true;
//       action.play();
//       currentAction.current = action;
//       setIsAnimating(true);
//     } else {
//       // Reverse animation
//       if (currentAction.current) {
//         currentAction.current.paused = false;
//         currentAction.current.timeScale = -1; // Reverse animation

//         // Wait for the reverse animation to complete
//         currentAction.current.clampWhenFinished = true;
//         currentAction.current.loop = THREE.LoopOnce;

//         // When reverse animation finishes, reset to original state
//         currentAction.current.clampWhenFinished = true;
//         currentAction.current.onLoop = () => {
//           // Restore original transforms when reverse animation completes
//           scene.traverse((child) => {
//             const savedTransform = originalTransforms.current.find(
//               (t) => t.uuid === child.uuid
//             );
//             if (savedTransform && child.isMesh) {
//               child.position.copy(savedTransform.position);
//               child.rotation.copy(savedTransform.rotation);
//               child.scale.copy(savedTransform.scale);
//             }
//           });
//           setIsAnimating(false);
//         };
//       }
//     }
//   };

//   useEffect(() => {
//     // Store original transformations
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

//     // Debugging node selection
//     console.log("All nodes:", nodes);

//     // Try multiple methods to find the target node
//     const targetNodeName = "bolt";
//     let targetNode = nodes[targetNodeName];

//     console.log("Target node by direct access:", targetNode);

//     if (!targetNode) {
//       // Fallback: search through scene
//       scene.traverse((child) => {
//         if (child.name === targetNodeName) {
//           targetNode = child;
//         }
//       });
//     }

//     // Find a mesh within the node if possible
//     let realTarget = null;
//     targetNode?.traverse?.((child) => {
//       if (child.isMesh && !realTarget) {
//         realTarget = child;
//         console.log("Found mesh target:", realTarget);
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
//             <Hotspot target={hotspotTarget} />
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

// function App() {
//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       <Canvas
//         className="canvas"
//         camera={{ position: [0, -3, -3], fov: 50 }}
//         style={{ width: "100%", height: "100%" }}
//       >
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[2, 2, 5]} intensity={1} />
//         <Suspense fallback={null}>
//           <AnimatedModel scale={5} />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//     </div>
//   );
// }

// export default App;


