
"use client";

import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

type CareerData = {
  title: string;
  description: string;
  phase: string;
  hours: number;
  status: "locked" | "active" | "completed";
};

type CareerNodeType = Node<CareerData, "career">;

const initialNodes: CareerNodeType[] = [
  {
    id: "html",
    type: "career",
    position: { x: 0, y: 0 },
    data: {
      title: "HTML & CSS",
      description: "Build accessible, responsive interfaces.",
      phase: "01 · Foundations",
      hours: 20,
      status: "completed",
    },
  },
  {
    id: "js",
    type: "career",
    position: { x: 0, y: 170 },
    data: {
      title: "JavaScript",
      description: "Learn functions, objects, async code and DOM.",
      phase: "01 · Foundations",
      hours: 30,
      status: "completed",
    },
  },
  {
    id: "git",
    type: "career",
    position: { x: 300, y: 0 },
    data: {
      title: "Git & GitHub",
      description: "Version control and collaborative workflows.",
      phase: "02 · Developer workflow",
      hours: 8,
      status: "active",
    },
  },
  {
    id: "react",
    type: "career",
    position: { x: 300, y: 170 },
    data: {
      title: "React & State",
      description: "Components, hooks, forms and application state.",
      phase: "02 · Core skills",
      hours: 35,
      status: "active",
    },
  },
  {
    id: "api",
    type: "career",
    position: { x: 600, y: 0 },
    data: {
      title: "API Integration",
      description: "Connect interfaces to real backend services.",
      phase: "03 · Production skills",
      hours: 15,
      status: "locked",
    },
  },
  {
    id: "project",
    type: "career",
    position: { x: 600, y: 170 },
    data: {
      title: "Portfolio Project",
      description: "Build and deploy a polished real-world app.",
      phase: "03 · Portfolio",
      hours: 25,
      status: "locked",
    },
  },
  {
    id: "target",
    type: "career",
    position: { x: 900, y: 85 },
    data: {
      title: "Frontend Engineer",
      description: "Prepare your portfolio and interview skills.",
      phase: "04 · Target role",
      hours: 20,
      status: "locked",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "html", target: "js" },
  { id: "e2", source: "js", target: "react" },
  { id: "e3", source: "git", target: "api" },
  { id: "e4", source: "react", target: "project" },
  { id: "e5", source: "api", target: "target" },
  { id: "e6", source: "project", target: "target" },
  { id: "e7", source: "html", target: "git" },
].map((edge) => ({
  ...edge,
  type: "smoothstep",
  animated: true,
  style: { stroke: "#6366f1", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
}));

function CareerNode({ data }: NodeProps<CareerNodeType>) {
  const colors = {
    completed: "#34d399",
    active: "#a78bfa",
    locked: "#64748b",
  };

  const color = colors[data.status];

  return (
    <div
      style={{
        width: 225,
        padding: 16,
        borderRadius: 14,
        background: "#111827",
        color: "#f8fafc",
        border: `1px solid ${color}`,
        boxShadow: `0 0 22px ${color}15`,
      }}
    >
      <Handle type="target" position={Position.Left} />

      <div
        style={{
          fontSize: 10,
          color,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 9,
        }}
      >
        {data.status === "completed"
          ? "✓ COMPLETED"
          : data.status === "active"
            ? "◉ IN PROGRESS"
            : "◌ UPCOMING"}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
        {data.title}
      </div>

      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6 }}>
        {data.description}
      </div>

      <div style={{ fontSize: 11, color: "#a5b4fc", marginTop: 12 }}>
        {data.phase}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { career: CareerNode };

export default function Home() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedId, setSelectedId] = useState<string | null>("react");

  const selectedNode = nodes.find((node) => node.id === selectedId);
  const completed = nodes.filter(
    (node) => node.data.status === "completed"
  ).length;

  const interactiveNodes = useMemo(() => nodes, [nodes]);

  function completeMilestone() {
    if (!selectedId) return;

    setNodes((current) =>
      current.map((node) =>
        node.id === selectedId
          ? {
              ...node,
              data: { ...node.data, status: "completed" },
            }
          : node
      )
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080d19",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "22px 28px",
          borderBottom: "1px solid #253047",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 23, fontWeight: 800 }}>
            <span style={{ color: "#a78bfa" }}>✳</span> PATHFORGE
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 5 }}>
            YOUR CAREER. REVERSE-ENGINEERED.
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#c4b5fd" }}>
          FRONTEND ENGINEER · DEMO ROADMAP
        </div>
      </header>

      <section style={{ padding: "22px 28px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 27, margin: "0 0 8px" }}>
              Your skill tree
            </h1>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
              Explore milestones, discover prerequisites, and track your journey.
            </p>
          </div>

          <div
            style={{
              padding: "13px 18px",
              background: "#151d30",
              border: "1px solid #293650",
              borderRadius: 12,
              minWidth: 145,
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 12 }}>
              MILESTONES COMPLETED
            </div>
            <div style={{ fontSize: 23, fontWeight: 700, marginTop: 5 }}>
              {completed} / {nodes.length}
            </div>
            <div
              style={{
                marginTop: 10,
                height: 4,
                background: "#293650",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  height: 4,
                  width: `${(completed / nodes.length) * 100}%`,
                  background: "#34d399",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 20px 24px" }}>
        <div
          style={{
            height: "66vh",
            minHeight: 430,
            border: "1px solid #253047",
            borderRadius: 16,
            overflow: "hidden",
            background: "#0b1120",
          }}
        >
          <ReactFlow
            nodes={interactiveNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onNodeClick={(_, node) => setSelectedId(node.id)}
          >
            <Background color="#263249" gap={22} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const status = (node.data as CareerData).status;
                return status === "completed"
                  ? "#34d399"
                  : status === "active"
                    ? "#a78bfa"
                    : "#64748b";
              }}
              style={{ background: "#111827" }}
            />
          </ReactFlow>
        </div>
      </section>

      {selectedNode && (
        <section
          style={{
            margin: "0 20px 30px",
            padding: 22,
            borderRadius: 16,
            background: "#111827",
            border: "1px solid #293650",
          }}
        >
          <div style={{ color: "#a78bfa", fontSize: 11, letterSpacing: 1 }}>
            SELECTED MILESTONE
          </div>

          <h2 style={{ fontSize: 22, marginBottom: 8 }}>
            {selectedNode.data.title}
          </h2>

          <p style={{ color: "#9ca3af", lineHeight: 1.7 }}>
            {selectedNode.data.description}
          </p>

          <p style={{ color: "#c4b5fd", fontSize: 13 }}>
            Estimated effort: {selectedNode.data.hours} hours
          </p>

          <p style={{ color: "#94a3b8", fontSize: 13 }}>
            Phase: {selectedNode.data.phase}
          </p>

          <button
            onClick={completeMilestone}
            disabled={selectedNode.data.status === "completed"}
            style={{
              padding: "11px 16px",
              background:
                selectedNode.data.status === "completed"
                  ? "#253047"
                  : "#7c3aed",
              color: "white",
              border: 0,
              borderRadius: 9,
              cursor:
                selectedNode.data.status === "completed"
                  ? "default"
                  : "pointer",
              opacity: selectedNode.data.status === "completed" ? 0.65 : 1,
            }}
          >
            {selectedNode.data.status === "completed"
              ? "Milestone completed ✓"
              : "Mark as completed"}
          </button>
        </section>
      )}
    </main>
  );
}
