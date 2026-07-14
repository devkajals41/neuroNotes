import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

function ConceptMap({ concepts }) {
  if (!concepts || concepts.length === 0) {
    return null;
  }

  const nodes = concepts.map((concept, index) => ({
    id: String(index + 1),

    data: {
      label: concept,
    },

    position: {
      x: 250 + Math.sin(index) * 200,

      y: index * 120,
    },
  }));

  const edges = concepts.slice(1).map((_, index) => ({
    id: `e${index + 1}-${index + 2}`,

    source: String(index + 1),

    target: String(index + 2),

    animated: true,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default ConceptMap;
