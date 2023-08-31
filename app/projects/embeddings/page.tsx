"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//@ts-ignore
import * as tsne from "./tsne";
import { Spinner, Switch } from "@material-tailwind/react";
import ExternalLink from "@App/components/atoms/ExternalLink";

export default () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = React.useState<
    { embedding: number[]; label: string }[]
  >([]);
  const [is3D, setIs3D] = useState<boolean>(true);

  const generateScene = useCallback(() => {
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
      window.innerHeight - 66 - 48 - (window.innerWidth < 768 ? 252 : 200)
    );
    containerRef.current.firstChild &&
      containerRef.current.removeChild(containerRef.current.firstChild);
    containerRef.current.appendChild(renderer.domElement);

    // Initialize t-SNE data
    const tsneData = new tsne.tSNE({
      dim: is3D ? 3 : 2,
      perplexity: 50,
    });
    tsneData.initDataRaw(data.map((item) => item.embedding));

    const axesHelper = new THREE.AxesHelper(4);
    const originX = is3D ? 0 : -2;
    const originY = is3D ? 0 : -1;

    const axisOrigin = new THREE.Vector3(originX, originY, 0);
    axesHelper.position.copy(axisOrigin);
    scene.add(axesHelper);

    const points = new THREE.Group();

    const minX = Math.min(...tsneData.Y.map((coords: any) => coords[0]));
    const minY = Math.min(...tsneData.Y.map((coords: any) => coords[1]));
    const minZ = Math.min(...tsneData.Y.map((coords: any) => coords[2]));

    tsneData.Y.forEach((coords: any, index: number) => {
      const multiplier = 5000;
      const x = originX + (coords[0] - minX) * multiplier;
      const y = originY + (coords[1] - minY) * multiplier;
      const z = (coords[2] - minZ) * multiplier;
      // Create a point
      const geometry = new THREE.BufferGeometry();
      const verticesArr = is3D ? [x, y, z] : [x, y];
      const vertices = new Float32Array(verticesArr);
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, is3D ? 3 : 2)
      );

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

      sprite.position.set(x, y, is3D ? z : 0);

      points.add(sprite);
    });

    scene.add(points);

    // Set camera position
    is3D ? camera.position.set(2, 3, 5) : camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);

    // Add event listener for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update(); // Update camera controls
    };
    animate();
  }, [data, is3D]);

  useEffect(() => {
    generateScene();
  }, [generateScene]);

  useEffect(() => {
    (async () => {
      setLoading(true);
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
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-start pt-12 pl-12 pr-12 lg:items-start">
        <div className="mb-8 md:mb-10">
          <h1 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">
            Notion page word-embeddings 3D Visualization
          </h1>
          <p className="text-sm md:text-xl opacity-60">
            Using t-distributed stochastic neighbor embedding (t-SNE) to reduce
            word embeddings dimensionality and plotting in 3D space.
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full overflow-x-scroll pl-12 no-scrollbar">
        <div className="flex flex-col gap-4 w-full min-w-fit md:min-w-none md:max-w-fit">
          <ExternalLink
            label="Edit content on Notion page"
            href="https://solar-fox-a61.notion.site/Flash-dataset-chatbot-90ae074d502a41be99096e6585838941"
          />
        </div>
        <div className="flex flex-col gap-4 w-full min-w-fit md:min-w-none md:max-w-fit">
          <ExternalLink
            label="Chat with gpt-3.5-turbo fine-tuned with this embeddings"
            href="/projects/chatbot/notion"
          />
        </div>
        <Switch
          label="3D"
          onChange={(e) => {
            setIs3D(e.target.checked);
          }}
          checked={is3D}
        />
      </div>
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Spinner />
          {loading && <div className="mt-4">Fetching data...</div>}
        </div>
      ) : (
        <div ref={containerRef} />
      )}
    </>
  );
};
