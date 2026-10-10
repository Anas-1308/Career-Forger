
export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type MilestoneStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type LearningResource = {
  title: string;
  url: string;
  type: "article" | "video" | "course" | "practice";
};

export type RoadmapSubstep = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  resources: LearningResource[];
};

export type RoadmapNode = {
  id: string;
  title: string;
  skills: string[];
  project: string;
  estimatedHours: number;
  status: MilestoneStatus;
  substeps: RoadmapSubstep[];
  resources: LearningResource[];
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
