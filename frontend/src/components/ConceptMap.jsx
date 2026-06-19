import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

function ConceptMap({ concepts }) {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  const nodes = concepts.map((concept, index) => ({
    id: String(index + 1),
    data: { label: concept },
    position: {
      x: 250,
      y: index * 100,
    },
  }));

  const edges = concepts.slice(1).map((_, index) => ({
    id: `e${index + 1}-${index + 2}`,
    source: String(index + 1),
    target: String(index + 2),
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default ConceptMap;
