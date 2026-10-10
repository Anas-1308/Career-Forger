
"use client";

import { useState } from "react";
import type {
  Roadmap,
  RoadmapRequest,
  SkillLevel,
} from "@/types/roadmap";

type GoalFormProps = {
  onRoadmapGenerated: (roadmap: Roadmap) => void;
};

export default function GoalForm({
  onRoadmapGenerated,
}: GoalFormProps) {
  const [careerGoal, setCareerGoal] = useState(
    "Frontend Developer"
  );
  const [skillLevel, setSkillLevel] =
    useState<SkillLevel>("Beginner");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload: RoadmapRequest = {
      careerGoal,
      skillLevel,
      hoursPerWeek,
    };

    try {
     
const response = await fetch("/api/roadmap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const raw = await response.text();

let result: any;

try {
  if (!raw.trim()) {
    throw new Error("The API returned an empty response.");
  }

  result = JSON.parse(raw);
} catch {
  throw new Error(
    `Invalid API response (${response.status}). Check your terminal for details.`
  );
}

if (!response.ok) {
  throw new Error(
    result.error || "Could not generate roadmap."
  );
}

// Keep your existing success-handling code below this line.

      onRoadmapGenerated(result as Roadmap);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl space-y-4 rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm"
    >
      <div>
        <label
          htmlFor="careerGoal"
          className="mb-1 block text-sm font-medium"
        >
          What is your target career?
        </label>
        <input
          id="careerGoal"
          value={careerGoal}
          onChange={(event) =>
            setCareerGoal(event.target.value)
          }
          required
          minLength={2}
          maxLength={150}
          className="w-full rounded-lg border p-3"
          placeholder="e.g. Frontend Developer"
        />
      </div>

      <div>
        <label
          htmlFor="skillLevel"
          className="mb-1 block text-sm font-medium"
        >
          Your current skill level
        </label>
        <select
          id="skillLevel"
          value={skillLevel}
          onChange={(event) =>
            setSkillLevel(event.target.value as SkillLevel)
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="hoursPerWeek"
          className="mb-1 block text-sm font-medium"
        >
          Hours available per week
        </label>
        <input
          id="hoursPerWeek"
          type="number"
          min={1}
          max={80}
          step={1}
          value={hoursPerWeek}
          onChange={(event) =>
            setHoursPerWeek(Number(event.target.value))
          }
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading || careerGoal.trim().length < 2}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Forging your roadmap..." : "Generate Roadmap"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
