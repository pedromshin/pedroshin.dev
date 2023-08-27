"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
//@ts-ignore
import * as tsne from "./tsne";

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<
    { embedding: number; label: string }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight - 66);
    containerRef.current.appendChild(renderer.domElement);

    const tsneData = new tsne.tSNE({
      dim: 3,
      perplexity: 50,
    });

    tsneData.initDataRaw(data.map((item) => item.embedding));

    const points = new THREE.Group();

    tsneData.Y.forEach((coords: any, index: number) => {
      const multiplier = 10000;
      const x = coords[0] * multiplier;
      const y = coords[1] * multiplier;
      const z = coords[2] * multiplier;

      // Create a point
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([x, y, z]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({ color: 0x000000, size: 0.1 });
      const point = new THREE.Points(geometry, material);

      // Create a text sprite for the index
      const spriteCanvas = document.createElement("canvas");
      const context = spriteCanvas.getContext("2d");
      if (!context) return;
      context.font = "Bold 16px Arial";
      context.fillStyle = "rgba(255, 255, 255, 1)";
      context.fillText(data[index].label, 0, 16);
      const spriteTexture = new THREE.CanvasTexture(spriteCanvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.5, 0.25, 1);

      // Position the point and text
      point.position.set(x, y, z);
      sprite.position.set(x, y, z);

      // Add point and text to the group
      points.add(point);
      points.add(sprite);
    });

    scene.add(points);

    // Set camera position
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, [data]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/projects/embeddings");
      const data = await response.json();
      setData(
        data.data.data.map((item: { embedding: number; content: string }) => {
          return {
            embedding: item.embedding,
            label: item.content,
          };
        })
      );
    })();
  }, []);

  return (
    <div>
      <div ref={containerRef}></div>
      <div id="embedding-space" data-sr="fade in over 5s"></div>
    </div>
  );
};
