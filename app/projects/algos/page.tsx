"use client"
// import JSON from "./bn-fly-drosophila_medulla_1.json"
import JSON from "./roadNet-CA.json"

class Graph {
    public adjacencyList;
    public nodes;
    public edges;

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
        const [origin, destination] = edge
        this.adjacencyList.get(origin).push(destination);
        this.adjacencyList.get(destination).push(origin);

        return [origin, destination];
    };
}

const relations = JSON.data.split(' ').map(Number);

const edges: number[][] = [];

for (let i = 0; i < relations.length; i += 2) {
    edges.push([relations[i], relations[i + 1]]);
}

const nodes = Array.from(new Set(relations))

export default () => {
    const graph = new Graph({ nodes, edges });

    return <></>
}