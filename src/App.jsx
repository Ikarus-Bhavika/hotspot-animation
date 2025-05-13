
import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';


function Hotspot({ nodeRef, modelRef, localPosition,label }) {
  const [worldPos, setWorldPos] = useState([0, 0, 0]);

  const tempNodePos = useRef(new THREE.Vector3());
  const tempModelPos = useRef(new THREE.Vector3());
  const adjustedPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (nodeRef.current && modelRef.current) {
      nodeRef.current.getWorldPosition(tempNodePos.current);
      modelRef.current.getWorldPosition(tempModelPos.current);

      const diff = tempNodePos.current.clone().sub(tempModelPos.current);

      adjustedPos.current
        .set(...localPosition)
        .add(diff)
        .applyMatrix4(modelRef.current.matrixWorld);

      setWorldPos([
        adjustedPos.current.x,
        adjustedPos.current.y,
        adjustedPos.current.z,
      ]);
    }
  });

  return (
    <Html position={worldPos}>
      <div
        style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '3px',
            borderRadius: '25%',
            cursor: 'pointer',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
            transform: 'translate(-50%, -50%)',
          }}
        >
            <img
      src="/images.jpeg" 
      alt={label}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '3px',
        marginBottom: '2px',
        objectFit: 'cover',
      }}
    />
    
          <span
            style={{
              fontSize: '8px',
              color: 'black',
              textAlign: 'center',
              wordBreak: 'break-word',
              padding: '2px',
            }}
          >
            {label}
          </span>
      </div>
    </Html>
  );
}


function AnimatedModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF('/nullFergo Valve_Textured (2)-v-0-v-.glb');
  const { actions } = useAnimations(animations, group);

  const [hotspots, setHotspots] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentAction = useRef(null);
  const originalTransforms = useRef([]);

  
  useEffect(() => {
    originalTransforms.current = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        originalTransforms.current.push({
          uuid: child.uuid,
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone(),
        });
      }
    });

    if (group.current) {
      group.current.updateMatrixWorld(true);
    }
  }, [scene]);

 
  const toggleAnimation = () => {
    if (!actions || animations.length === 0) return;

    const action = actions[animations[0].name];

    if (!isAnimating) {
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.timeScale = 1;
      action.enabled = true;
      action.play();
      currentAction.current = action;
      setIsAnimating(true);
    } else {
      if (currentAction.current) {
        currentAction.current.paused = false;
        currentAction.current.timeScale = -1;
        currentAction.current.clampWhenFinished = true;
        currentAction.current.loop = THREE.LoopOnce;

        currentAction.current.onLoop = () => {
          scene.traverse((child) => {
            const savedTransform = originalTransforms.current.find(
              (t) => t.uuid === child.uuid
            );
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
    e.stopPropagation();
    const clickedObject = e.object;
    const worldClickPos = e.point.clone();
    const localClickPos = group.current.worldToLocal(worldClickPos.clone());
    const nodeRef = { current: clickedObject };

    const existingIndex = hotspots.findIndex((h) =>
      new THREE.Vector3(...h.localPosition).distanceTo(localClickPos) < 0.1
    );

    if (existingIndex >= 0) {
      const newHotspots = [...hotspots];
      newHotspots.splice(existingIndex, 1);
      setHotspots(newHotspots);
    } else {
      setHotspots([
        ...hotspots,
        {
          id: clickedObject.uuid + Date.now(),
          localPosition: [localClickPos.x, localClickPos.y, localClickPos.z],
          nodeRef: nodeRef,
          label: clickedObject.name 
        },
      ]);
    }
  };

  return (
    <>
      <group ref={group} {...props}>
        <primitive object={scene} onClick={handleClick} />
        {hotspots.map((hotspot) => (
          <Hotspot
            key={hotspot.id}
            nodeRef={hotspot.nodeRef}
            modelRef={group}
            localPosition={hotspot.localPosition}
            label={hotspot.label}
          />
        ))}
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
            zIndex: 10,
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
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, -3, -3], fov: 50 }}
        style={{ width: '100%', height: '100%',backgroundColor:'white' }}
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

