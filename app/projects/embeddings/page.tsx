"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
//@ts-ignore
import * as tsne from "./tsne";

import { data } from "./data.json";

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const tsneData = new tsne.tSNE({
      dim: 3,
      perplexity: 50,
    });

    tsneData.initDataRaw(data);

    const points = tsneData.Y.map((coords: any) => {
      const multiplier = 10000;
      const x = coords[0] * multiplier;
      const y = coords[1] * multiplier;
      const z = coords[2] * multiplier;
      const position = [x, y, z];
      const pointGeometry = new THREE.BufferGeometry();
      const pointMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.1,
      });

      const positions = new Float32Array(position);

      console.log(positions);
      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      return new THREE.Points(pointGeometry, pointMaterial);
    });

    points.forEach((point: any) => scene.add(point));

    // Set camera position
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div>
      <div ref={containerRef}></div>
      <div id="embedding-space" data-sr="fade in over 5s"></div>
    </div>
  );
};
