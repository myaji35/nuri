// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';

export default function ThreeTestSimple() {
  const mountRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!mountRef.current || hasInitialized.current) return;
    hasInitialized.current = true;

    console.log('ThreeTestSimple: Starting initialization');

    // Dynamic import to avoid SSR issues
    import('three').then((THREE) => {
      console.log('Three.js loaded successfully');

      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      scene.background = null; // Transparent background

      // Camera
      const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current!.appendChild(renderer.domElement);

      // Globe
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0x1e3a5f,
        shininess: 10
      });
      const globe = new THREE.Mesh(geometry, material);
      scene.add(globe);

      // Wireframe overlay
      const wireframeGeometry = new THREE.SphereGeometry(2.01, 24, 16);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x90ee90,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      scene.add(wireframe);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.003;
        wireframe.rotation.y += 0.003;

        renderer.render(scene, camera);
      };

      animate();
      console.log('ThreeTestSimple: Animation started');

      // Handle resize
      const handleResize = () => {
        const newWidth = mountRef.current!.clientWidth;
        const newHeight = mountRef.current!.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        wireframeGeometry.dispose();
        wireframeMaterial.dispose();
      };
    }).catch((error) => {
      console.error('Failed to load Three.js:', error);
    });
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  );
}