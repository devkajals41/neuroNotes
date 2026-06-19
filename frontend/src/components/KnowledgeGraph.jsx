import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

function KnowledgeGraph({ graphData }) {
  if (!graphData) return null;

  const nodes = graphData.nodes.map((node, index) => ({
    id: node,
    data: { label: node },
    position: {
      x: 200 + (index % 3) * 200,
      y: 100 + Math.floor(index / 3) * 150,
    },
  }));

  const edges = graphData.edges.map((edge, index) => ({
    id: `e${index}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default KnowledgeGraph;
