'use client';

import { Canvas } from '@react-three/fiber';
import Scene from '@/components/Scene';
import HUD from '@/components/HUD';

export default function Home() {
  return (
    <main className="relative w-full h-full bg-[#000510] overflow-hidden">
      {/* 3D Canvas - Behind everything */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
      {/* HUD - On top with pointer-events-none so it doesn't block canvas */}
      <HUD />
    </main>
  );
}
