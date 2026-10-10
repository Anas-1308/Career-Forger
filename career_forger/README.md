# Career_Forger 🚀
### Forge Your Future with AI

## 1. What It Does

Career_Forger is an AI-powered career roadmap generator that helps students and beginners turn their career goals into structured learning plans. Using Google's Gemini AI, it generates milestones, required skills, practical projects, estimated learning hours, and learning substeps with resources to guide users toward their target careers.

**Problem Statement Number:** [Add your assigned problem statement number here]

## 2. Done / Left / Plan

### Done ✅
- Built a responsive web interface using Next.js, React, TypeScript, and Tailwind CSS.
- Integrated Google's Gemini API to generate personalized career roadmaps.
- Added backend request and response validation using Zod.
- Created interactive roadmap visualization using React Flow.
- Added milestone cards containing skills, projects, and estimated hours.
- Implemented milestone completion and dashboard progress calculations.
- Extended the roadmap data structure and AI response schema to support learning substeps and resources.

### Left 🔧
- Complete and test the expandable milestone details interface.
- Connect individual substep checkboxes to milestone and overall progress.
- Improve error handling for API failures and invalid AI responses.
- Test the application with different career goals and skill levels.
- Verify resource links and refine the user experience.
- Deploy the application and add the live URL.

### Plan for the Next 16 Hours
1. **Hours 1–4:** Finish the expandable learning steps, checkboxes, and resource panels.
2. **Hours 5–7:** Connect substep completion to milestone status and overall progress.
3. **Hours 8–10:** Test different career goals, skill levels, and API error scenarios.
4. **Hours 11–13:** Fix bugs, improve responsiveness, and polish the interface.
5. **Hours 14–16:** Deploy the application, update documentation, and rehearse the final demo.

*Adjust the Done section to reflect what has actually been tested and completed before submission.*

## 3. Architecture and Why

### Architecture

Career_Forger uses a Next.js application with a frontend, a server-side API route, and Google's Gemini AI service.

1. **Frontend:** React and TypeScript manage the user interface, roadmap state, milestone cards, and progress indicators.
2. **API layer:** The Next.js route at `app/api/roadmap/route.ts` receives career goals and validates requests.
3. **AI generation:** The backend calls Google's Gemini API to generate structured roadmap data.
4. **Validation:** Zod validates the input and the generated roadmap structure before the result is returned.
5. **Visualization:** React Flow (`@xyflow/react`) renders milestones as graph nodes and learning dependencies as edges.
6. **Progress tracking:** React state updates completion indicators when users mark milestones or learning tasks complete.

### Why These Technologies?

- **Next.js:** Provides frontend routing and server-side API functionality in one application.
- **TypeScript:** Defines consistent data structures and helps catch type-related errors.
- **Tailwind CSS:** Enables rapid development of a responsive, consistent interface.
- **Gemini API:** Generates career-specific learning plans dynamically instead of relying entirely on hard-coded roadmaps.
- **Zod:** Helps ensure the generated data follows the structure expected by the frontend.
- **React Flow:** Makes learning dependencies easier to explore visually than a plain list.

### Real-Time Approach

Roadmaps are generated on demand when users submit their career goals. The frontend sends a request to the backend, which calls Gemini and returns the generated roadmap.

The application uses React state to update progress indicators interactively. It does not currently require WebSockets or a real-time database.

### Data Store

The current implementation keeps the generated roadmap and completion changes in frontend React state. A persistent database has not been confirmed as part of the current implementation, so progress may reset when the page is refreshed.

A future version could use a database such as PostgreSQL or Supabase to save user roadmaps and completion history.

## 4. What We Added

Beyond a basic career roadmap generator, Career_Forger includes or is being extended with:

- **Interactive career map:** Visualizes milestones and their dependencies using a graph.
- **Progress dashboard:** Summarizes completed milestones, estimated hours, and overall progress.
- **Learning substeps:** Breaks large milestones into smaller, actionable tasks.
- **Learning resources:** Provides relevant articles, courses, videos, and practice links.
- **Task-level completion:** Allows users to track progress through individual learning activities.
- **Responsive dark dashboard:** Makes the roadmap easier to explore across different screen sizes.

These features help users move beyond receiving a plan and begin tracking their learning journey.

*Features still under development should be described as planned rather than completed during the final submission.*

## 5. How to Run It

### Prerequisites
- Node.js and npm
- A Google Gemini API key

### Installation

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and add:

   ```dotenv
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Replace the placeholder with your own API key. Never commit the key to a public repository.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.
7. Enter a career goal, select the appropriate skill level and weekly learning hours, and generate a roadmap.

### Build Check

Run the production build to check for build-time errors:

```bash
npm run build
```

### Test Login

No login is required in the current implementation.

### Live URL

[Add your deployed application URL here after deployment.]

## 6. Tools and AI Used

### Technologies and Libraries
- Next.js
- React
- TypeScript
- Tailwind CSS
- `@xyflow/react`
- Zod
- `@google/genai`

### AI Service
- **Provider:** Google
- **Model configured:** `gemini-3.8-flash`
- **Purpose:** Generate structured, personalized career roadmaps, learning milestones, skills, projects, and learning tasks.

### Responsible AI Disclosure

Career_Forger uses AI to generate career-learning recommendations. Users should understand that the generated plans, time estimates, and resources may need verification and should be treated as guidance rather than guaranteed outcomes.

The Gemini API key is configured through a server-side environment variable and should not be exposed in frontend code or public repositories.

## 7. Who It Is For

Career_Forger is designed for:

- Students exploring technology careers.
- Beginners who need a structured learning path.
- Self-taught developers planning their next steps.
- Career switchers moving into a new technical field.
- Learners who want practical projects alongside theory.

Users can return to the application to review their roadmap, work through learning substeps, and monitor their progress. Persistent accounts and saved progress could make this experience more useful in future versions.
