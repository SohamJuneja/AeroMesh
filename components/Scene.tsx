'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationEngine } from '@/lib/simulation';

function City() {
    // Create a grid of buildings
    const buildings = useMemo(() => {
        const items = [];
        // Create a grid of 10x10 blocks
        for (let x = -5; x <= 5; x++) {
            for (let z = -5; z <= 5; z++) {
                if (Math.random() > 0.7) { // 30% chance of building
                    const height = 10 + Math.random() * 30;
                    items.push({
                        position: [x * 20, height / 2, z * 20],
                        scale: [15, height, 15],
                        color: Math.random() > 0.9 ? '#FF003C' : '#001133' // Occasional red building
                    });
                }
            }
        }
        return items;
    }, []);

    return (
        <group>
            {/* Floor Grid */}
            <gridHelper args={[400, 40, '#00F0FF', '#111111']} position={[0, 0.1, 0]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[400, 400]} />
                <meshBasicMaterial color="#000510" />
            </mesh>

            {/* Buildings */}
            {buildings.map((b, i) => (
                <mesh key={i} position={b.position as [number, number, number]}>
                    <boxGeometry args={b.scale as [number, number, number]} />
                    <meshStandardMaterial
                        color={b.color}
                        emissive={b.color === '#FF003C' ? '#550011' : '#000000'}
                        roughness={0.2}
                        metalness={0.8}
                    />
                    {/* Glowing edges */}
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(...(b.scale as [number, number, number]))]} />
                        <lineBasicMaterial color="#0044AA" transparent opacity={0.3} />
                    </lineSegments>
                </mesh>
            ))}
        </group>
    );
}

function Drones() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const engineRef = useRef<SimulationEngine>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        engineRef.current = new SimulationEngine();
    }, []);

    useFrame(() => {
        if (!engineRef.current || !meshRef.current) return;

        // Run simulation tick
        engineRef.current.tick();

        // Update instances
        engineRef.current.drones.forEach((drone, i) => {
            dummy.position.copy(drone.position);

            // Orient drone to velocity
            const target = drone.position.clone().add(drone.velocity);
            dummy.lookAt(target);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 50]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial
                color="#00FF41"
                emissive="#00FF41"
                emissiveIntensity={2}
                toneMapped={false}
            />
        </instancedMesh>
    );
}

export default function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[60, 60, 60]} fov={50} />
            <OrbitControls
                maxPolarAngle={Math.PI / 2 - 0.1}
                autoRotate
                autoRotateSpeed={0.5}
                enablePan={true}
            />

            <ambientLight intensity={0.2} />
            <pointLight position={[100, 100, 50]} intensity={1} color="#00F0FF" />
            <pointLight position={[-100, 50, -50]} intensity={1} color="#FF003C" />

            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <City />
            <Drones />

            <fog attach="fog" args={['#000510', 50, 250]} />
        </>
    );
}
