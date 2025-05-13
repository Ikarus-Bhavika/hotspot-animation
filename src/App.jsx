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