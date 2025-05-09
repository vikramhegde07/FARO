import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';

function IslandModel({ refProp }) {
    const gltf = useGLTF('/models/island.glb');
    const clonedScene = clone(gltf.scene); // ✅ Prevents reuse conflict
    // Optional: animate rotation only on X-axis
    useFrame(() => {
        if (refProp.current) {
            refProp.current.rotation.x = 0;
            refProp.current.rotation.y += 0.005;
            refProp.current.rotation.z = 0;
        }
    });

    return (
        <primitive
            object={clonedScene}
            scale={2}
            position={[0, 1, 0]}
            rotation={[0, 0.5, 0]}
            ref={refProp}
        />
    );
}

function FloatingLabel({ text = 'Island', targetRef }) {
    const navigate = useNavigate();
    const textRef = useRef();

    useFrame(() => {
        if (targetRef.current && textRef.current) {
            // Always follow the island position
            const position = targetRef.current.position;
            textRef.current.position.set(position.x, position.y + 0.3, position.z);
        }
    });

    return (
        <Text
            ref={textRef}
            fontSize={0.4}
            color="#000" // 🔥 Change label color here
            anchorX="center"
            anchorY="bottom"
            cursor="pointer"
        >
            {text}
        </Text>
    );
}

const IslandCanvas = ({ title }) => {
    const localIslandRef = useRef();

    return (
        <Canvas
            shadows
            camera={{ position: [0, 2, 5], fov: 45 }}
            style={{ width: '100%', height: '250px' }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight castShadow intensity={1} position={[5, 10, 5]} />
            <Environment preset="sunset" />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

            <Suspense fallback={null}>
                <IslandModel refProp={localIslandRef} />
                <FloatingLabel text={title} targetRef={localIslandRef} />
            </Suspense>
        </Canvas>
    );
};

export default IslandCanvas;
