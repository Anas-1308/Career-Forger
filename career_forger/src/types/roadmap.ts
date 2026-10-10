
export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type RoadmapNode = {
  id: string;
  title: string;
  skills: string[];
  project: string;
  estimatedHours: number;
  status: MilestoneStatus;
};

export type RoadmapEdge = {
  source: string;
  target: string;
};

export type Roadmap = {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  targetRole: string;
  estimatedWeeks: number;
};

export type RoadmapRequest = {
  careerGoal: string;
  skillLevel: SkillLevel;
  hoursPerWeek: number;
};
