
"use client";

import { useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";


import "@xyflow/react/dist/style.css";

import GoalForm from "@/components/GoalForm";
import type { Roadmap } from "@/types/roadmap";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const toggleMilestone = (id: string) => {
    setRoadmap((current) => {
      if (!current) return current;

      return {
        ...current,
        nodes: current.nodes.map((milestone) =>
          milestone.id === id
            ? {
                ...milestone,
                status:
                  milestone.status === "completed"
                    ? "not_started"
                    : "completed",
              }
            : milestone
        ),
      };
    });
  };

  const totalMilestones = roadmap?.nodes.length ?? 0;

  const completedMilestones =
    roadmap?.nodes.filter(
      (milestone) => milestone.status === "completed"
    ).length ?? 0;

  const progressPercentage =
    totalMilestones === 0
      ? 0
      : Math.round(
          (completedMilestones / totalMilestones) * 100
        );

  const completedHours =
    roadmap?.nodes
      .filter((milestone) => milestone.status === "completed")
      .reduce(
        (total, milestone) => total + milestone.estimatedHours,
        0
      ) ?? 0;

  const graphNodes: Node[] = (roadmap?.nodes ?? []).map(
    (milestone, index) => ({
      id: milestone.id,
      position: {
        x: index * 260,
        y: 100,
      },
      data: {
        label: milestone.title,
      },
      style: {
        width: 200,
        padding: 14,
        borderRadius: 12,
        border: "1px solid #a5b4fc",
        background: "#eef2ff",
        color: "#1e1b4b",
        fontWeight: 600,
      },
    })
  );

  const graphEdges: Edge[] = (roadmap?.edges ?? []).map(
    (edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      animated: false,
    })
  );

  return (
    <main className="min-h-screen space-y-8 bg-gray-50 p-6 text-gray-900 md:p-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Career_Forger
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Forge your career path
        </h1>
        <p className="mt-2 text-gray-600">
          Tell us where you want to go. AI will help map
          the milestones to get you there.
        </p>
      </header>

      <GoalForm onRoadmapGenerated={setRoadmap} />

      {roadmap && (
        <section className="space-y-4">
          
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
  <div className="rounded-xl border bg-white p-5">
    <p className="text-sm text-gray-500">
      Overall progress
    </p>
    <p className="mt-2 text-3xl font-bold">
      {progressPercentage}%
    </p>
    <div
      className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Roadmap completion"
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-all"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  </div>

  <div className="rounded-xl border bg-white p-5">
    <p className="text-sm text-gray-500">
      Milestones completed
    </p>
    <p className="mt-2 text-3xl font-bold">
      {completedMilestones}/{totalMilestones}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5">
    <p className="text-sm text-gray-500">
      Estimated hours completed
    </p>
    <p className="mt-2 text-3xl font-bold">
      {completedHours}h
    </p>
  </div>
</div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                {roadmap.targetRole} roadmap
              </h2>
              <p className="text-gray-600">
                {roadmap.nodes.length} milestones ·
                {" "}{roadmap.estimatedWeeks} estimated weeks
              </p>
            </div>
          </div>

          <div className="h-[480px] overflow-hidden rounded-2xl border bg-white">
            <ReactFlow
              nodes={graphNodes}
              edges={graphEdges}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              nodesDraggable
              nodesConnectable={false}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          <h3 className="text-xl font-bold">
            Your milestones
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.nodes.map((milestone, index) => (
              <article
                key={milestone.id}
                className="rounded-xl border bg-white p-5"
              >
                <p className="text-sm font-medium text-indigo-600">
                  Milestone {index + 1} · {milestone.estimatedHours} hours
                </p>

                <h4 className="mt-2 text-lg font-bold">
                  {milestone.title}
                </h4>

                <p className="mt-2 text-sm text-gray-600">
                  {milestone.project}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {milestone.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                
<div className="mt-4 flex items-center justify-between gap-3">
  <span className="text-sm text-gray-500">
    Status: {milestone.status.replace("_", " ")}
  </span>

  <button
    type="button"
    onClick={() => toggleMilestone(milestone.id)}
    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
      milestone.status === "completed"
        ? "border border-gray-300 text-gray-700"
        : "bg-indigo-600 text-white"
    }`}
  >
    {milestone.status === "completed"
      ? "Undo completion"
      : "Mark complete"}
  </button>
</div>

              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
