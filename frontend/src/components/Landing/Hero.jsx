import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = () => {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#8352FD"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0}
      />
    </Sphere>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="h-screen w-full bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Car Management
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Experience the next generation of fleet control. Seamless, intuitive, and powerful.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity transform hover:scale-105 duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-500/20 transition-all transform hover:scale-105 duration-200"
            >
              Login
            </button>
          </div>
        </div>
        <div className="h-[500px] w-full relative">
          <Canvas>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <AnimatedSphere />
              <OrbitControls enableZoom={false} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Background Gradient Blob */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/20 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
