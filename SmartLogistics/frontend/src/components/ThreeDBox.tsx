'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box as DreiBox, Edges } from '@react-three/drei';
import React from 'react';

// Color palette for items
const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#ec4899'];

interface Props {
  box_length: number;
  box_width: number;
  box_height: number;
  placed_items: Array<{
    product_name: string;
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
  }>;
}

export default function ThreeDBox({ box_length, box_width, box_height, placed_items }: Props) {
  return (
    <div style={{ width: '100%', height: '400px', background: '#1c1c1f', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [box_length * 1.5, box_height * 1.5, box_width * 1.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1} />
        <OrbitControls makeDefault />

        {/* The Outer Box Frame */}
        <group position={[box_length / 2, box_height / 2, box_width / 2]}>
          <DreiBox args={[box_length, box_height, box_width]}>
            <meshStandardMaterial transparent opacity={0.1} color="#ffffff" />
            <Edges scale={1.0} threshold={15} color="#475569" />
          </DreiBox>
        </group>

        {/* The Packed Items */}
        {placed_items.map((item, i: number) => {
           // We map Z -> Height in visualization usually, but here:
           // From backend: length (l), width (w), height (h) 
           // Coordinates: x, y, z
           // ThreeJS is X (right), Y (up), Z (forward)
           // Let's assume Backend X -> local X, Backend Z -> local Y (height), Backend Y -> local Z
           const cx = item.x + item.length / 2;
           const cy = item.z + item.height / 2;
           const cz = item.y + item.width / 2;

           return (
             <group key={i} position={[cx, cy, cz]}>
               <DreiBox args={[item.length, item.height, item.width]}>
                 <meshStandardMaterial color={colors[i % colors.length]} />
                 <Edges scale={1.0} color="black" />
               </DreiBox>
             </group>
           );
        })}
      </Canvas>
    </div>
  );
}
