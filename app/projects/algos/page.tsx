"use client"
import { useEffect, useRef } from "react";
import JSON from "./bn-fly-drosophila_medulla_1.json";
import * as d3 from 'd3';

class Graph {
    public adjacencyList: Map<number, number[]>;
    public nodes: number[];
    public edges: number[][];

    constructor(params: { nodes: number[], edges: number[][] }) {
        this.adjacencyList = new Map();
        this.nodes = params.nodes.map((node) => this.addNode(node));
        this.edges = params.edges.map((edge) => this.addEdge([...edge]));
    }

    addNode(node: number) {
        this.adjacencyList.set(node, []);

        return node;
    };

    addEdge(edge: number[]) {
        const [source, target] = edge
        this.adjacencyList.get(source)?.push(target);
        this.adjacencyList.get(target)?.push(source);

        return [source, target];
    };
}

const data = JSON.data.split(' ');

const relations = data.map(Number);

const edges: number[][] = [];

for (let i = 0; i < relations.length; i += 2) {
    edges.push([relations[i], relations[i + 1]]);
}

const nodes = Array.from(new Set(relations))

const graph = new Graph({ nodes, edges });

export default () => {
    const graphRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(graphRef.current)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        const links = graph.edges.map(([source, target]) => ({ source, target }));

        const simulation = d3.forceSimulation(nodes.map(node => ({ index: node })))
            .force('link', d3.forceLink(links).id(d => d.index ?? 0))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(500, 300));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(2));

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 5)
            .attr('fill', '#69b3a2');

        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y);
        });

        return () => {
            simulation.stop();
          };
    }, []);

    return (
        <div className="h-full w-full">
            <span>Open debugger (ctrl + shift + i) to see graph data.</span>
            <div ref={graphRef} className="h-full w-full" />
        </div>
    );
}