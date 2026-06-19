import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

function KnowledgeGraph({
  graphData,
}) {
  if (!graphData) return null;

  const nodes =
    graphData.nodes.map(
      (node, index) => ({
        id: node,

        data: {
          label: node,
        },

        position: {
          x:
            100 +
            (index % 3) * 250,

          y:
            100 +
            Math.floor(
              index / 3
            ) *
              180,
        },
      })
    );

  const edges =
    graphData.edges.map(
      (edge, index) => ({
        id: `e${index}`,

        source:
          edge.source,

        target:
          edge.target,

        label:
          edge.label,

        animated: true,
      })
    );

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default KnowledgeGraph;