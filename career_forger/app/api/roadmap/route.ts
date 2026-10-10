
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate what the frontend sends us.
const RequestSchema = z.object({
  careerGoal: z.string().trim().min(2).max(150),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hoursPerWeek: z.number().int().min(1).max(80),
});

// Validate what the AI sends back.
const RoadmapSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      skills: z.array(z.string()).min(1),
      project: z.string(),
      estimatedHours: z.number().positive(),
      status: z.enum([
        "not_started",
        "in_progress",
        "completed",
      ]),
    })
  ).min(1),

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
    // 1. Read and validate the user's input.
    const body: unknown = await request.json();
    const inputResult = RequestSchema.safeParse(body);

    if (!inputResult.success) {
      return Response.json(
        {
          error: "Invalid input. Check your career goal, skill level, and weekly hours.",
        },
        { status: 400 }
      );
    }

    const { careerGoal, skillLevel, hoursPerWeek } =
      inputResult.data;

    // 2. Ask AI to generate a roadmap.
    const aiResponse = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
You are an expert career roadmap planner.

Return only valid JSON with these fields:
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
- Make each milestone suitable for the user's skill level.
- Every edge must connect existing milestone IDs.
- An edge means the source milestone must come before the target.
- Use unique IDs.
- Status must be "not_started" for every new milestone.
- estimatedHours must be a positive number.
- estimatedWeeks must be a positive whole number.
- Account for the user's available hours per week.
- Use realistic projects and actionable skills.
- Set targetRole to the exact career goal supplied by the user.
- Return JSON only, without Markdown fences or extra commentary.
      `,
      input: JSON.stringify({
        careerGoal,
        skillLevel,
        hoursPerWeek,
      }),
    });

    // 3. Parse and validate the AI response.
    const rawText = aiResponse.output_text;

    if (!rawText) {
      throw new Error("The AI returned an empty response.");
    }

    const parsed = JSON.parse(rawText);
    const roadmap = RoadmapSchema.parse(parsed);

    // 4. Check that every prerequisite refers to a real milestone.
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
        { error: "The AI generated invalid milestone connections. Please try again." },
        { status: 502 }
      );
    }

    // Keep the goal exactly as the user entered it.
    return Response.json({
      ...roadmap,
      targetRole: careerGoal,
    });
  } catch (error) {
    console.error("Roadmap API error:", error);

    return Response.json(
      { error: "Could not generate a roadmap. Please try again." },
      { status: 500 }
    );
  }
}
