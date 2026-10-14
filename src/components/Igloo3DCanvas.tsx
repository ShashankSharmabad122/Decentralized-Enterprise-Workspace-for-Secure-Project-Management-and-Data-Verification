import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Igloo3DCanvasProps {
  mouseParallax?: boolean;
}

export const Igloo3DCanvas: React.FC<Igloo3DCanvasProps> = ({
  mouseParallax = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    /* ── Device capability detection ─────────────────────── */
    const isMobile  = window.innerWidth < 768;
    const isTablet  = window.innerWidth < 1024;
    const isLowEnd  = isMobile || isTablet;

    // Scale down particle count and crystal count on mobile
    const PART_COUNT     = isMobile ? 180 : isTablet ? 350 : 600;
    const CRYSTAL_COUNT  = isMobile ? 5   : isTablet ? 8   : 11;
    const PIXEL_RATIO    = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);

    // ── Scene Setup ───────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040d14, isLowEnd ? 0.022 : 0.028);

    const W = el.clientWidth, H = el.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,   // disable antialiasing on mobile for perf
      alpha: true,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setClearColor(0x040d14, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    el.appendChild(renderer.domElement);

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x7ab8d0, 0.6));

    const keyLight = new THREE.DirectionalLight(0xe8f4f8, 1.2);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x4a9ab5, 3.5, 60);
    fillLight.position.set(-12, -8, 8);
    scene.add(fillLight);

    // Skip rim light on mobile
    if (!isMobile) {
      const rimLight = new THREE.PointLight(0xb8d9e8, 2, 40);
      rimLight.position.set(0, 15, -10);
      scene.add(rimLight);
    }

    // ── ICE CRYSTAL MATERIAL ──────────────────────────────────
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0.55, 0.78, 0.92),
      metalness: 0.0,
      roughness: 0.08,
      transmission: isMobile ? 0.7 : 0.92,  // cheaper on mobile
      ior: 1.48,
      thickness: 1.8,
      clearcoat: isMobile ? 0.5 : 1.0,
      clearcoatRoughness: 0.05,
      specularIntensity: 1.2,
      reflectivity: 0.8,
      side: THREE.FrontSide,
    });

    const makeVariant = (hue: number) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(hue, 0.5, 0.72),
        metalness: 0,
        roughness: 0.1,
        transmission: isMobile ? 0.65 : 0.88,
        ior: 1.45,
        thickness: 1.4,
        clearcoat: isMobile ? 0.4 : 0.9,
        clearcoatRoughness: 0.06,
        side: THREE.FrontSide,
      });

    // ── CENTRAL CRYSTAL CLUSTER ───────────────────────────────
    const cluster = new THREE.Group();
    scene.add(cluster);

    const geoms = [
      new THREE.IcosahedronGeometry(2.8, 0),
      new THREE.OctahedronGeometry(2.2, 0),
      new THREE.DodecahedronGeometry(2.0, 0),
      new THREE.TetrahedronGeometry(2.4, 0),
    ];

    for (let i = 0; i < CRYSTAL_COUNT; i++) {
      const geom = geoms[i % geoms.length];
      const mat  = i % 3 === 0 ? makeVariant(0.54 + i * 0.02) : crystalMat;
      const mesh = new THREE.Mesh(geom, mat);

      const angle  = (i / CRYSTAL_COUNT) * Math.PI * 2;
      const radius = 2.5 + (i % 3) * 2.0;
      const height = (Math.random() - 0.5) * 6;

      mesh.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius - 4
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.scale.setScalar(0.4 + Math.random() * 0.8);
      cluster.add(mesh);
    }

    // ── WIREFRAME OVERLAY CLUSTER ─────────────────────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4a9ab5,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const wireCluster = new THREE.Group();
    const WIRE_COUNT = isMobile ? 3 : 6;
    for (let i = 0; i < WIRE_COUNT; i++) {
      const g = geoms[i % geoms.length];
      const m = new THREE.Mesh(g, wireMat);
      const angle = (i / WIRE_COUNT) * Math.PI * 2;
      m.position.set(Math.cos(angle) * 8, (Math.random() - 0.5) * 10, Math.sin(angle) * 8 - 8);
      m.scale.setScalar(1.5 + Math.random() * 2);
      wireCluster.add(m);
    }
    scene.add(wireCluster);

    // ── PARTICLE SYSTEM — Ice Dust ─────────────────────────────
    const pPositions = new Float32Array(PART_COUNT * 3);
    const pColors    = new Float32Array(PART_COUNT * 3);
    const pSizes     = new Float32Array(PART_COUNT);

    for (let i = 0; i < PART_COUNT; i++) {
      const r     = 30 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      pColors[i * 3]     = 0.4 + t * 0.4;
      pColors[i * 3 + 1] = 0.65 + t * 0.25;
      pColors[i * 3 + 2] = 0.8 + t * 0.2;
      pSizes[i] = 0.8 + Math.random() * 2.5;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));
    pGeo.setAttribute('size',     new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── MOUSE / TOUCH PARALLAX ─────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // On touch devices use touch instead of mouse
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      mouseRef.current.x = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    };

    if (mouseParallax) {
      if (isMobile) {
        window.addEventListener('touchmove', onTouchMove, { passive: true });
      } else {
        window.addEventListener('mousemove', onMouseMove);
      }
    }

    // ── RESIZE ─────────────────────────────────────────────────
    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── ANIMATION LOOP ─────────────────────────────────────────
    let camX = 0, camY = 0;
    let raf: number;
    let t = 0;

    // Reduce animation speed on mobile to save battery
    const ROT_SPEED = isMobile ? 0.001 : 0.0018;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.004;

      cluster.rotation.y    += ROT_SPEED;
      cluster.rotation.x    = Math.sin(t * 0.3) * 0.12;
      wireCluster.rotation.y -= 0.0006;

      particles.rotation.y  += 0.0003;
      particles.rotation.x  += 0.0001;

      if (mouseParallax) {
        camX += (mouseRef.current.x * 2.5 - camX) * 0.04;
        camY += (-mouseRef.current.y * 2.0 - camY) * 0.04;
        camera.position.x = camX;
        camera.position.y = camY;
        camera.lookAt(0, 0, 0);
      }

      // Skip fill light pulse on mobile (saves CPU)
      if (!isMobile) {
        fillLight.intensity = 3.0 + Math.sin(t * 1.2) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
      geoms.forEach(g => g.dispose());
      pGeo.dispose();
      crystalMat.dispose();
      pMat.dispose();
    };
  }, [mouseParallax]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};
