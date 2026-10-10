
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// Read the Gemini API key from .env.local.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Add it to .env.local in your project root."
  );
}

const ai = new GoogleGenAI({ apiKey });

// Validate what the frontend sends us.
const RequestSchema = z.object({
  careerGoal: z.string().trim().min(2).max(150),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hoursPerWeek: z.number().int().min(1).max(80),
});

// Validate the roadmap returned by Gemini.
const RoadmapSchema = z.object({
  nodes: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        skills: z.array(z.string()).min(1),
        project: z.string(),
        estimatedHours: z.number().positive(),
        status: z.enum([
          "not_started",
          "in_progress",
          "completed",
        ]),
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
    // 1. Read and validate user input.
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

    // 2. Ask Gemini to generate a roadmap.
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `
You are an expert career roadmap planner.

Create a practical, ordered career roadmap using the following input:
${JSON.stringify({
  careerGoal,
  skillLevel,
  hoursPerWeek,
})}

Return ONLY valid JSON with exactly this structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "title": "Milestone title",
      "skills": ["skill 1", "skill 2"],
      "project": "A practical project to build",
      "estimatedHours": 10,
      "status": "not_started"
    }
  ],
  "edges": [
    { "source": "first-id", "target": "second-id" }
  ],
  "targetRole": "exact career goal",
  "estimatedWeeks": 12
}

Rules:
- Create 5 to 10 ordered, practical milestones.
- Adapt every milestone to the user's skill level.
- Every edge must connect two existing milestone IDs.
- An edge means the source milestone must come before the target.
- Use unique IDs.
- Set every new milestone status to "not_started".
- estimatedHours must be a positive number.
- estimatedWeeks must be a positive whole number.
- Make the total workload realistic for the available hours per week.
- Include actionable skills and a practical project for each milestone.
- Set targetRole to the exact career goal supplied by the user.
- Return JSON only, without Markdown fences or extra commentary.
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
                },
                required: [
                  "id",
                  "title",
                  "skills",
                  "project",
                  "estimatedHours",
                  "status",
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

    // 3. Parse and validate Gemini's response.
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
        "Gemini returned a roadmap with an invalid structure. Please try again."
      );
    }

    const roadmap = roadmapResult.data;

    // 4. Validate milestone connections.
    const nodeIds = new Set(
      roadmap.nodes.map((node) => node.id)
    );

    const validEdges = roadmap.edges.every(
      (edge) =>
        nodeIds.has(edge.source) &&
        nodeIds.has(edge.target) &&
        edge.source !== edge.target
    );

    if (!validEdges) {
      return Response.json(
        {
          error:
            "Gemini generated invalid milestone connections. Please try again.",
        },
        { status: 502 }
      );
    }

    // 5. Return the same response shape expected by the frontend.
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
