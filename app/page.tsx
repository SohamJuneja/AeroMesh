'use client';

import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import HUD from '@/components/HUD';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#000510] overflow-hidden">
      <HUD />
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
    </main>
  );
}
