
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Add it to .env.local in your project root."
  );
}

const ai = new GoogleGenAI({ apiKey });

const ResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["article", "video", "course", "practice"]),
});

const SubstepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  completed: z.boolean(),
  resources: z.array(ResourceSchema),
});

const RequestSchema = z.object({
  careerGoal: z.string().trim().min(2).max(150),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hoursPerWeek: z.number().int().min(1).max(80),
});

const RoadmapSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        skills: z.array(z.string()).min(1),
        project: z.string().min(1),
        estimatedHours: z.number().positive(),
        status: z.enum([
          "not_started",
          "in_progress",
          "completed",
        ]),
        substeps: z.array(SubstepSchema).min(2).max(6),
        resources: z.array(ResourceSchema),
      })
    )
    .min(1),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
    })
  ),
  targetRole: z.string(),
  estimatedWeeks: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const inputResult = RequestSchema.safeParse(body);

    if (!inputResult.success) {
      return Response.json(
        {
          error:
            "Invalid input. Check your career goal, skill level, and weekly hours.",
        },
        { status: 400 }
      );
    }

    const { careerGoal, skillLevel, hoursPerWeek } =
      inputResult.data;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are an expert career mentor and learning roadmap planner.

Create a practical, ordered learning roadmap for this user:
${JSON.stringify({ careerGoal, skillLevel, hoursPerWeek })}

Return JSON with exactly these top-level fields:
nodes, edges, targetRole, estimatedWeeks.

Each node must contain:
- id: unique string
- title: milestone title
- skills: array of skills
- project: practical project description
- estimatedHours: positive number
- status: "not_started"
- substeps: array of 3 to 5 smaller actionable tasks
- resources: array of useful learning resources

Each substep must contain:
- id: unique string across the roadmap
- title: short actionable task
- description: explain what the user should do
- estimatedMinutes: positive whole number
- completed: false
- resources: array of learning resources

Each resource must contain:
- title: resource name
- url: full valid HTTPS URL
- type: one of "article", "video", "course", "practice"

Resource rules:
- Prefer well-known, reputable learning websites and official documentation.
- Use URLs you have high confidence are real and relevant.
- Never invent a specific page URL if unsure; use a well-known official learning homepage instead.
- Resources should match the milestone or substep.
- Include 1 to 3 resources for each substep when possible.
- Milestone-level resources may be an empty array.

Roadmap rules:
- Create 5 to 8 ordered milestones.
- Adapt difficulty to the user's skill level.
- Give every milestone 3 to 5 useful substeps.
- Every new milestone status must be "not_started".
- Every new substep completed value must be false.
- Use unique milestone IDs and unique substep IDs.
- Every edge must connect existing milestone IDs.
- Edges represent learning dependencies.
- Make workload and estimated duration realistic for the user's weekly hours.
- Return the exact career goal as targetRole.
- estimatedWeeks must be a positive whole number.
- Return JSON only. Do not include Markdown fences or commentary.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            nodes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  title: { type: "STRING" },
                  skills: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                  },
                  project: { type: "STRING" },
                  estimatedHours: { type: "NUMBER" },
                  status: {
                    type: "STRING",
                    enum: [
                      "not_started",
                      "in_progress",
                      "completed",
                    ],
                  },
                  substeps: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        title: { type: "STRING" },
                        description: { type: "STRING" },
                        estimatedMinutes: { type: "INTEGER" },
                        completed: { type: "BOOLEAN" },
                        resources: {
                          type: "ARRAY",
                          items: {
                            type: "OBJECT",
                            properties: {
                              title: { type: "STRING" },
                              url: { type: "STRING" },
                              type: {
                                type: "STRING",
                                enum: [
                                  "article",
                                  "video",
                                  "course",
                                  "practice",
                                ],
                              },
                            },
                            required: ["title", "url", "type"],
                          },
                        },
                      },
                      required: [
                        "id",
                        "title",
                        "description",
                        "estimatedMinutes",
                        "completed",
                        "resources",
                      ],
                    },
                  },
                  resources: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        title: { type: "STRING" },
                        url: { type: "STRING" },
                        type: {
                          type: "STRING",
                          enum: [
                            "article",
                            "video",
                            "course",
                            "practice",
                          ],
                        },
                      },
                      required: ["title", "url", "type"],
                    },
                  },
                },
                required: [
                  "id",
                  "title",
                  "skills",
                  "project",
                  "estimatedHours",
                  "status",
                  "substeps",
                  "resources",
                ],
              },
            },
            edges: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  source: { type: "STRING" },
                  target: { type: "STRING" },
                },
                required: ["source", "target"],
              },
            },
            targetRole: { type: "STRING" },
            estimatedWeeks: { type: "INTEGER" },
          },
          required: [
            "nodes",
            "edges",
            "targetRole",
            "estimatedWeeks",
          ],
        },
      },
    });

    const rawText = aiResponse.text;

    if (!rawText) {
      throw new Error("Gemini returned an empty response.");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("Gemini returned invalid JSON:", rawText);
      throw new Error(
        "Gemini returned invalid JSON. Please try again."
      );
    }

    const roadmapResult = RoadmapSchema.safeParse(parsed);

    if (!roadmapResult.success) {
      console.error(
        "Invalid roadmap structure:",
        roadmapResult.error.flatten()
      );

      throw new Error(
        "Gemini returned an invalid roadmap structure. Please try again."
      );
    }

    const roadmap = roadmapResult.data;

    const nodeIds = new Set(roadmap.nodes.map((node) => node.id));
    const substepIds = new Set<string>();

    const validSubsteps = roadmap.nodes.every((node) =>
      node.substeps.every((substep) => {
        if (substepIds.has(substep.id)) {
          return false;
        }

        substepIds.add(substep.id);
        return true;
      })
    );

    const validEdges = roadmap.edges.every(
      (edge) =>
        nodeIds.has(edge.source) &&
        nodeIds.has(edge.target) &&
        edge.source !== edge.target
    );

    if (!validEdges || !validSubsteps) {
      return Response.json(
        {
          error:
            "The generated roadmap contains invalid connections or duplicate substep IDs. Please try again.",
        },
        { status: 502 }
      );
    }

    return Response.json({
      ...roadmap,
      targetRole: careerGoal,
    });
  } catch (error) {
    console.error("Gemini roadmap API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    return Response.json({ error: message }, { status: 500 });
  }
}
