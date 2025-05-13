// import React, { Suspense, useRef, useEffect, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
// import * as THREE from 'three';
// import './App.css';

// function Hotspot({ target }) {
//   const [position, setPosition] = useState(null);

//   useFrame(() => {
//     if (target) {
//       target.updateMatrixWorld(true);
//       const pos = new THREE.Vector3();
//       target.getWorldPosition(pos);
//       console.log('World Position:', pos);
//       setPosition(pos.toArray());
//     }
//   });

//   if (!position) return null;

//   return (
//     <Html position={position}>
//       <div
//         style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: '2px',
//           borderRadius: '50%',
//           cursor: 'pointer',
//           width: '10px',
//           height: '10px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         i
//       </div>
//     </Html>
//   );
// }

// function AnimatedModel(props) {
//   const group = useRef();
//   const { scene, animations, nodes } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
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
//             const savedTransform = originalTransforms.current.find(t => t.uuid === child.uuid);
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
//           scale: child.scale.clone()
//         });
//       }
//     });

//     // Find the node you want to track for the hotspot
//   //   const targetNode = nodes['Fergo_Valve003'];
//   //   console.log('Target Node:', targetNode);
//   //   setHotspotTarget(targetNode);
//   // }, [scene, nodes]);
//   const targetNode = nodes['Fergo_Valve003'];
//   let realTarget = null;

//   targetNode?.traverse?.((child) => {
//     if (child.isMesh && !realTarget) {
//       realTarget = child;
//     }
//   });

//   setHotspotTarget(realTarget || targetNode);
// }, [nodes]);

//   const handleClick = (e) => {
//     // e.preventDefault();
//     console.log(e.point);
//   }

//   return (
//     <>
//       <group ref={group} {...props}>
//         <primitive object={scene}  onClick={(e)=>handleClick(e)}/>
//         {hotspotTarget && <Hotspot target={hotspotTarget} />}
//       </group>
//       <Html>
//         <button
//           onClick={toggleAnimation}
//           style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             padding: '10px 20px',
//             backgroundColor: isAnimating ? 'red' : 'green',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             zIndex: 10
//           }}
//         >
//           {isAnimating ? 'Stop' : 'Start'} Animation

//         </button>

//       </Html>
//     </>
//   );
// }

// function App() {
//   return (
//     <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
//       <Canvas
//         className="canvas"
//         camera={{ position: [0, -3, -3], fov: 50 }}
//         style={{ width: '100%', height: '100%', }}
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
// import React, { Suspense, useRef, useEffect, useState } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
// import * as THREE from 'three';
// import './App.css';

// function Hotspot({ object }) {
//   const [worldPos, setWorldPos] = useState([0, 0, 0]);
  
//   useFrame(() => {
//     if (object) {
//       // Get the current world position of the object
//       const pos = new THREE.Vector3();
//       object.updateWorldMatrix(true, false);
//       object.getWorldPosition(pos);
//       setWorldPos([pos.x, pos.y, pos.z]);
//     }
//   });

//   return (
//     <Html position={worldPos}>
//       <div
//         style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: '5px',
//           borderRadius: '50%',
//           cursor: 'pointer',
//           width: '20px',
//           height: '20px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//           fontWeight: 'bold',
//           color: '#000',
//           transform: 'translate(-50%, -50%)',
//         }}
//       >
//         i
//       </div>
//     </Html>
//   );
// }

// function AnimatedModel(props) {
//   const group = useRef();
//   const { scene, animations, nodes } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
//   const { actions } = useAnimations(animations, group);
  
//   // State to track the specific nodes for hotspots and animation
//   const [hotspots, setHotspots] = useState([]);
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
//             const savedTransform = originalTransforms.current.find(t => t.uuid === child.uuid);
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
//           scale: child.scale.clone()
//         });
//       }
//     });
//   }, [scene]);

//   const handleClick = (e) => {
//     e.stopPropagation();
    
//     // Get the clicked object (this is the actual mesh that was clicked)
//     const clickedObject = e.object;

//     // Local position on the surface that was clicked
//     const localPosition = e.point.clone();
//     clickedObject.updateWorldMatrix(true, false);
  
//     // World position of the object
//     const worldPosition = new THREE.Vector3();
//     clickedObject.getWorldPosition(worldPosition);
  
//     console.log('Clicked Object:', clickedObject.name || clickedObject.uuid);
//     console.log('Local Click Position (e.point):', localPosition);
//     console.log('Object World Position:', worldPosition);
    
 
//     // Check if we already have a hotspot for this object
//     const existingIndex = hotspots.findIndex(h => h.object.uuid === clickedObject.uuid);
    
//     if (existingIndex >= 0) {
//       // Remove the hotspot if it already exists (toggle behavior)
//       const newHotspots = [...hotspots];
//       newHotspots.splice(existingIndex, 1);
//       setHotspots(newHotspots);
//     } else {
//       // Add a new hotspot for this object
//       setHotspots([...hotspots, { 
//         id: clickedObject.uuid,
//         object: clickedObject
//       }]);
//     }
//   };

//   return (
//     <>
//       <group ref={group} {...props}>
//         <primitive object={scene} onClick={handleClick} />
        
//         {/* Render all hotspots */}
//         {hotspots.map((hotspot) => (
//           <Hotspot 
//             key={hotspot.id}
//             object={hotspot.object}
//           />
//         ))}
//       </group>
      
//       <Html>
//         <button
//           onClick={toggleAnimation}
//           style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             padding: '10px 20px',
//             backgroundColor: isAnimating ? 'red' : 'green',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             zIndex: 10
//           }}
//         >
//           {isAnimating ? 'Stop' : 'Start'} Animation
//         </button>
        
//         <div
//           style={{
//             position: 'absolute',
//             bottom: '20px',
//             left: '20px',
//             padding: '10px',
//             backgroundColor: 'rgba(0,0,0,0.7)',
//             color: 'white',
//             borderRadius: '5px',
//             zIndex: 10
//           }}
//         >
//           Click on any part to add/remove a hotspot
//         </div>
//       </Html>
//     </>
//   );
// }

// function App() {
//   return (
//     <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
//       <Canvas
//         className="canvas"
//         camera={{ position: [0, -3, -3], fov: 50 }}
//         style={{ width: '100%', height: '100%' }}
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

// import React, { Suspense, useRef, useEffect, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
// import * as THREE from 'three';
// import './App.css';

// function Hotspot({ position }) {

//   useEffect(() => {
//     console.log('Hotspot Rendered at Position:', position);
//   }, [position]);

//   return (
//     <Html position={[position.x, position.y, position.z]}>
//       <div
//         style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: '2px',
//           borderRadius: '50%',
//           cursor: 'pointer',
//           width: '10px',
//           height: '10px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//           fontWeight: 'bold',
//           color: 'grey',
//           transform: 'translate(-50%, -50%)',
//         }}
//       >
//         i
//       </div>
//     </Html>
//   );
// }

// function AnimatedModel(props) {
//   const group = useRef();
//   const { scene, animations } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
//   const { actions } = useAnimations(animations, group);
  
//   const [hotspots, setHotspots] = useState([]);
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
//         currentAction.current.clampWhenFinished = true;
//         currentAction.current.loop = THREE.LoopOnce;

//         currentAction.current.onLoop = () => {
//           scene.traverse((child) => {
//             const savedTransform = originalTransforms.current.find(t => t.uuid === child.uuid);
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
//     originalTransforms.current = [];
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         originalTransforms.current.push({
//           uuid: child.uuid,
//           position: child.position.clone(),
//           rotation: child.rotation.clone(),
//           scale: child.scale.clone()
//         });
//       }
//     });
//   }, [scene]);

//   const handleClick = (e) => {
//     e.stopPropagation();
//     const clickedObject = e.object;

//     // Convert clicked point to world space
//     const worldClickPos = e.point.clone().applyMatrix4(clickedObject.matrixWorld);
//     console.log('Clicked Object:', clickedObject.name || clickedObject.uuid);
//     console.log('World Click Position:', worldClickPos);

   

//     // Check for existing hotspot at similar position (optional logic)
//     const existingIndex = hotspots.findIndex(h =>
//       h.position.distanceTo(worldClickPos) < 0.001
//     );

//     if (existingIndex >= 0) {
//       const newHotspots = [...hotspots];
//       newHotspots.splice(existingIndex, 1);
//       setHotspots(newHotspots);
//     } else {
//       setHotspots([...hotspots, {
//         id: clickedObject.uuid + Date.now(),
//         position: worldClickPos
      
//       }]);
//     }
//   };

//   return (
//     <>
//       <group ref={group} {...props}>
//         <primitive object={scene} onClick={handleClick} />

//         {hotspots.map((hotspot) => (
//           <Hotspot key={hotspot.id} position={hotspot.position} />
//         ))}
//       </group>

//       <Html>
//         <button
//           onClick={toggleAnimation}
//           style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             padding: '10px 20px',
//             backgroundColor: isAnimating ? 'red' : 'green',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             zIndex: 10
//           }}
//         >
//           {isAnimating ? 'Stop' : 'Start'} Animation
//         </button>

       
//       </Html>
//     </>
//   );
// }

// function App() {
//   return (
//     <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
//       <Canvas
//         className="canvas"
//         camera={{ position: [0, -3, -3], fov: 50 }}
//         style={{ width: '100%', height: '100%' }}
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

// import React, { Suspense, useRef, useEffect, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
// import * as THREE from 'three';
// import './App.css';

// function Hotspot({ position }) {
//   useEffect(() => {
//     console.log('Hotspot Rendered at Position:', position);
//   }, [position]);

//   return (
//     <Html position={position}>
//       <div
//         style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: '2px',
//           borderRadius: '50%',
//           cursor: 'pointer',
//           width: '10px',
//           height: '10px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           boxShadow: '0 0 5px rgba(0,0,0,0.3)',
//           fontWeight: 'bold',
//           color: 'grey',
//           transform: 'translate(-50%, -50%)',
//         }}
//       >
        
//       </div>
//     </Html>
//   );
// }

// function AnimatedModel(props) {
//   const group = useRef();
//   const { scene, animations } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
//   const { actions } = useAnimations(animations, group);
  
//   const [hotspots, setHotspots] = useState([]);
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
//         currentAction.current.clampWhenFinished = true;
//         currentAction.current.loop = THREE.LoopOnce;

//         currentAction.current.onLoop = () => {
//           scene.traverse((child) => {
//             const savedTransform = originalTransforms.current.find(t => t.uuid === child.uuid);
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
//     originalTransforms.current = [];
//     scene.traverse((child) => {
//       if (child.isMesh) {
//         originalTransforms.current.push({
//           uuid: child.uuid,
//           position: child.position.clone(),
//           rotation: child.rotation.clone(),
//           scale: child.scale.clone()
//         });
//       }
//     });
//   }, [scene]);

//   const handleClick = (e) => {
//     e.stopPropagation();
//     const clickedObject = e.object;
    

//     const worldClickPos = e.point.clone();
    
//     console.log('Clicked Object:', clickedObject.name || clickedObject.uuid);
//     console.log('World Click Position:', worldClickPos);
//     const localClickPos = group.current.worldToLocal(worldClickPos.clone());
//     console.log('local click position', localClickPos);

   
//     const existingIndex = hotspots.findIndex(h =>
//       new THREE.Vector3(h.x, h.y, h.z).distanceTo(worldClickPos) < 0.1
//     );

//     if (existingIndex >= 0) {
//       const newHotspots = [...hotspots];
//       newHotspots.splice(existingIndex, 1);
//       setHotspots(newHotspots);
//     } else {
//       setHotspots([...hotspots, {
//         id: clickedObject.uuid + Date.now(),
//         x: localClickPos.x,
//         y: localClickPos.y,
//         z: localClickPos.z
//       }]);
//     }
//   };

//   return (
//     <>
//       <group ref={group} {...props}>
//         <primitive object={scene} onClick={handleClick} />

//         {hotspots.map((hotspot) => (
//           <Hotspot 
//             key={hotspot.id} 
//             position={[hotspot.x, hotspot.y, hotspot.z]} 
//           />
//         ))}
//       </group>

//       <Html>
//         <button
//           onClick={toggleAnimation}
//           style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             padding: '10px 20px',
//             backgroundColor: isAnimating ? 'red' : 'green',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer',
//             zIndex: 10
//           }}
//         >
//           {isAnimating ? 'Stop' : 'Start'} Animation
//         </button>
//       </Html>
//     </>
//   );
// }

// function App() {
//   return (
//     <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
//       <Canvas
//         className="canvas"
//         camera={{ position: [0, -3, -3], fov: 50 }}
//         style={{ width: '100%', height: '100%' }}
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

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html, Stage } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';

function Hotspot({ target,position }) {
  // const [position, setPosition] = useState(null);
  // const [actualPosition, setActualPosition] = useState();
  const [actualPosition, setActualPosition] = useState(position);
  const [offsetRef] = useState(() => ({ value: null }));
  useFrame(() => {
    if (target) {
      target.updateMatrixWorld(true);
      const pos = new THREE.Vector3();
      target.getWorldPosition(pos);
      
      if (!offsetRef.value) {
        // Calculate and store the initial offset only once
        const actual = new THREE.Vector3().fromArray(actualPosition);
        offsetRef.value = actual.clone().sub(pos); // offset = actual - animated
      }

      const updatedActualPos = pos.clone().add(offsetRef.value);
      setActualPosition(updatedActualPos.toArray());

    }
  });

  // if (!position) return null;

  return (
    <Html position={actualPosition}>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '4px',
          borderRadius: '50%',
          cursor: 'pointer',
          width: '10px',
          height: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color:'black'
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

  const handleClick = (e) => {
    console.log(e.point);
  }

  useEffect(() => {
    // Store original transformations
    originalTransforms.current = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        child.onPointerDown = handleClick;
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

  return (
    <>
      <group ref={group} {...props}>
        <Stage>
        <primitive object={scene} onClick={(e)=>handleClick(e)}/>
        {hotspotTarget && <Hotspot target={scene.getObjectByName('Fergo_Valve003')} position={[-0.1146394476620296,0.215996371037993,0.0353179584531134]}/>}
        {hotspotTarget && <Hotspot target={scene.getObjectByName('Mesh011')} position={[-0.0146394476620296,0.355996371037993,0.0153179584531134]}/>}
        {hotspotTarget && <Hotspot target={scene.getObjectByName('Fergo_Valve020')} position={[-0.0746394476620296,0.085996371037993,0.0753179584531134]}/>}
        </Stage>
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
          <AnimatedModel />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;