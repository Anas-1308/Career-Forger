
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
      : Math.round((completedMilestones / totalMilestones) * 100);

  const completedHours =
    roadmap?.nodes
      .filter((milestone) => milestone.status === "completed")
      .reduce(
        (total, milestone) => total + milestone.estimatedHours,
        0
      ) ?? 0;

  const totalHours =
    roadmap?.nodes.reduce(
      (total, milestone) => total + milestone.estimatedHours,
      0
    ) ?? 0;

  const graphNodes: Node[] = (roadmap?.nodes ?? []).map(
    (milestone, index) => {
      const completed = milestone.status === "completed";

      return {
        id: milestone.id,
        position: {
          x: index * 260,
          y: 100,
        },
        data: {
          label: `${completed ? "✓  " : `${String(index + 1).padStart(2, "0")}  `}${milestone.title}`,
        },
        style: {
          width: 210,
          padding: 16,
          borderRadius: 16,
          border: completed
            ? "1px solid #34d399"
            : "1px solid #5145a5",
          background: completed ? "#102e2a" : "#19172f",
          color: completed ? "#a7f3d0" : "#ede9fe",
          fontWeight: 600,
          fontSize: 13,
          lineHeight: 1.6,
          boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
        },
      };
    }
  );

  const graphEdges: Edge[] = (roadmap?.edges ?? []).map(
    (edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#8b7cf6",
      },
      style: {
        stroke: "#8b7cf6",
        strokeWidth: 2,
      },
    })
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090f] text-slate-100">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="absolute right-0 top-[30rem] h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Header */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-xl text-violet-300 shadow-lg shadow-violet-950/30">
                ✦
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  Career<span className="text-violet-400">_Forger</span>
                </p>
                <p className="text-xs text-slate-500">
                  Your future, forged with AI
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI roadmap builder
          </div>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-medium text-violet-300">
              <span>✧</span>
              YOUR PERSONAL CAREER COPILOT
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your next chapter
              <br />
              starts <span className="text-violet-400">with a plan.</span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Turn your career ambition into a clear learning roadmap.
              Discover the skills, projects, and milestones that take you
              from where you are to where you want to be.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="text-violet-400">✦</span>
                AI-generated plans
              </span>
              <span className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                Track your progress
              </span>
              <span className="flex items-center gap-2">
                <span className="text-violet-400">↗</span>
                Project-based learning
              </span>
            </div>
          </div>

          {/* Goal form container */}
          <div className="rounded-3xl border border-white/[0.09] bg-[#11111b]/90 p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Start building
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Forge your roadmap
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Tell us your goal and we&apos;ll help you map the journey.
              </p>
            </div>

            <GoalForm onRoadmapGenerated={setRoadmap} />
          </div>
        </section>

        {/* Roadmap dashboard */}
        {roadmap && (
          <section className="space-y-6 border-t border-white/[0.08] pt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Your learning journey
                </p>
                <h2 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl">
                  {roadmap.targetRole}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  A roadmap tailored to your ambition, one milestone at a time.
                </p>
              </div>

              <div className="w-fit rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-slate-500">Estimated journey</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {roadmap.estimatedWeeks} weeks
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.12] to-[#11111b] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Overall progress</p>
                  <span className="text-lg text-violet-300">◉</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">
                  {progressPercentage}%
                </p>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.08]"
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Roadmap completion"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">Milestones completed</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  {completedMilestones}
                  <span className="ml-2 text-base font-medium text-slate-500">
                    / {totalMilestones}
                  </span>
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Keep moving forward
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">Hours invested</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  {completedHours}
                  <span className="ml-1 text-base font-medium text-slate-500">
                    hrs
                  </span>
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Of {totalHours} estimated hours
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">Still ahead</p>
                <p className="mt-3 text-3xl font-bold text-white">
                  {totalMilestones - completedMilestones}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Milestones to complete
                </p>
              </div>
            </div>

            {/* Flow diagram */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101019]">
              <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-white">
                    Your career map
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Explore the connections between your milestones.
                  </p>
                </div>
                <span className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                  {totalMilestones} milestones
                </span>
              </div>

              <div className="h-[420px] sm:h-[480px]">
                <ReactFlow
                  nodes={graphNodes}
                  edges={graphEdges}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  nodesDraggable
                  nodesConnectable={false}
                  proOptions={{ hideAttribution: true }}
                  defaultEdgeOptions={{
                    type: "smoothstep",
                  }}
                >
                  <Background color="#7770a0" gap={24} size={1} />
                  <Controls
                    className="!overflow-hidden !rounded-xl !border !border-white/10 !bg-[#191827] !shadow-xl [&>button]:!border-white/10 [&>button]:!bg-[#191827] [&>button]:!fill-slate-300 [&>button:hover]:!bg-violet-900"
                  />
                  <MiniMap
                    nodeColor={(node) =>
                      node.style?.background?.toString() ?? "#19172f"
                    }
                    maskColor="rgba(9, 9, 15, 0.75)"
                    className="!border !border-white/10 !bg-[#191827]"
                  />
                </ReactFlow>
              </div>
            </div>

            {/* Milestone cards */}
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Milestone checklist
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Small steps today. Big progress tomorrow.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                {completedMilestones} of {totalMilestones} completed
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {roadmap.nodes.map((milestone, index) => {
                const completed = milestone.status === "completed";

                return (
                  <article
                    key={milestone.id}
                    className={`group rounded-2xl border p-5 transition-colors duration-200 ${
                      completed
                        ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                        : "border-white/[0.08] bg-[#11111b] hover:border-violet-400/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                            completed
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-violet-400/20 bg-violet-400/10 text-violet-300"
                          }`}
                        >
                          {completed ? "✓" : String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-500">
                            MILESTONE {String(index + 1).padStart(2, "0")}
                          </p>
                          <h4 className="mt-1 break-words font-semibold leading-6 text-white">
                            {milestone.title}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          completed
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {completed ? "Completed" : "To do"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-violet-300">◷</span>
                      {milestone.estimatedHours} estimated hours
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Practical project
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {milestone.project}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Skills you'll learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-violet-400/15 bg-violet-400/[0.07] px-2.5 py-1.5 text-xs text-violet-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/[0.07] pt-4">
                      <button
                        type="button"
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#11111b] ${
                          completed
                            ? "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
                            : "bg-violet-600 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500"
                        }`}
                      >
                        {completed
                          ? "Undo completion"
                          : "✓  Mark as completed"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!roadmap && (
          <section className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-2xl text-violet-300">
              ✧
            </div>
            <h2 className="mt-5 text-lg font-semibold text-white">
              Your journey starts here
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Enter your dream role above to generate a personalized roadmap
              with actionable milestones, practical projects, and skills to master.
            </p>
          </section>
        )}

        <footer className="border-t border-white/[0.08] py-5 text-center text-xs text-slate-600">
          Career_Forger · Build skills. Create projects. Shape your future.
        </footer>
      </div>
    </main>
  );
}
