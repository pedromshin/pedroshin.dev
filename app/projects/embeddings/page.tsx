"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//@ts-ignore
import * as tsne from "./tsne";
import { Spinner } from "@material-tailwind/react";
import { set } from "lodash-es";
import Heading from "@App/components/organisms/Heading";

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [data, setData] = React.useState<
    { embedding: number[]; label: string }[]
  >([]);

  useEffect(() => {
    if (!containerRef.current || !data.length) return;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      window.innerWidth,
      window.innerHeight - 66 - (window.innerWidth < 768 ? 320 : 248)
    );
    containerRef.current.appendChild(renderer.domElement);

    // Initialize t-SNE data
    const tsneData = new tsne.tSNE({
      dim: 3,
      perplexity: 50,
    });
    tsneData.initDataRaw(data.map((item) => item.embedding));

    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    const points = new THREE.Group();

    const minX = Math.min(...tsneData.Y.map((coords: any) => coords[0]));
    const minY = Math.min(...tsneData.Y.map((coords: any) => coords[1]));
    const minZ = Math.min(...tsneData.Y.map((coords: any) => coords[2]));

    tsneData.Y.forEach((coords: any, index: number) => {
      const multiplier = 5000;
      const x = (coords[0] - minX) * multiplier;
      const y = (coords[1] - minY) * multiplier;
      const z = (coords[2] - minZ) * multiplier;
      // Create a point
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([x, y, z]);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      // Create a text sprite for the label
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

      sprite.position.set(x, y, z);

      points.add(sprite);
    });

    scene.add(points);

    // Set camera position
    camera.position.set(2, 3, 5);
    camera.lookAt(scene.position);

    // Add event listener for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update(); // Update camera controls
    };
    animate();
  }, [data]);

  useEffect(() => {
    (async () => {
      setFetching(true);
      const response = await fetch("/api/projects/embeddings");
      const data = await response.json();
      setData(
        data.data.data.map((item: { embedding: number[]; content: string }) => {
          return {
            embedding: item.embedding,
            label: item.content,
          };
        })
      );
      setFetching(false);
    })();
  }, []);

  return (
    <>
      <Heading
        title={"Embeddings 3D Visualization"}
        description="Using t-distributed stochastic neighbor embedding (t-SNE) to reduce word embeddings dimensionality and plotting in 3D space."
      ></Heading>
      {fetching ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Spinner />
          {fetching && <div className="mt-4">Fetching data...</div>}
        </div>
      ) : (
        <div ref={containerRef} />
      )}
    </>
  );
};
