# AgileFlow Scrum Board

AgileFlow is a full-stack Scrum/Kanban board built for a high school Computer Science technical presentation about **Scrum and Agile Workflow Management**. It looks and feels like a lightweight SaaS project management tool, while keeping the code readable enough to explain during a demo.

## Features

- Dashboard with sprint progress, task statistics, team workload, priority distribution, velocity, and burndown charts
- Scrum board with Backlog, To Do, In Progress, Testing, and Done columns
- Drag-and-drop task movement between workflow columns
- Grid/table view with task fields, filtering, sorting, and editable status/progress
- Task editor with title, description, priority, dates, status, assignee, progress, tags, notes, comments, checklist items, attachments, and color labels
- Fake team member system with roles, avatars, and assigned task counts
- Search and filters for priority, assignee, status, and sort order
- Dark/light mode toggle
- Sprint goal panel, activity log, notifications, AI task suggestion mockup, and calendar-style sprint dates
- Socket.io real-time update events
- JSON file persistence through a Node.js and Express backend
- Presentation support page explaining Agile, Scrum, Kanban, and real-world workflow usage

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Storage: JSON file database in `server/data.json`
- Charts: Recharts
- Real-time events: Socket.io
- Icons: Lucide React

## Project Structure

```text
scrumboard/
  server/
    data.json          # sample database
    index.js           # Express API + Socket.io server
  src/
    components/        # reusable React UI components
    api.js             # frontend API helper functions
    App.jsx            # main state and page layout
    constants.js       # shared labels and options
    main.jsx           # React entry point
    styles.css         # Tailwind and component classes
  index.html
  package.json
  vite.config.js
```

## Running the Project

Install dependencies:

```bash
npm install
```

Start the frontend and backend together:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:4000
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Routes

- `GET /api/health` checks that the server is running
- `GET /api/data` returns tasks, members, sprints, and activity
- `POST /api/tasks` creates a task
- `PATCH /api/tasks/:id` updates a task
- `DELETE /api/tasks/:id` deletes a task

These routes demonstrate basic CRUD operations, which are a major full-stack software engineering concept.

## How Scrum Relates To Software Engineering

Scrum helps teams break a large software project into smaller pieces of work. A sprint goal defines what the team is trying to finish, the board shows current workflow status, and task cards hold details like assignees, priority, due dates, and comments. This mirrors real software teams where developers, designers, testers, and product owners collaborate to ship working software in small increments.

## Screenshots

Add screenshots here after running the app:

- Dashboard view
- Scrum board view
- Grid view
- Agile explanation page
- Dark mode

## Demo Ideas

- Move a task from `In Progress` to `Testing`
- Use the search bar to find `API` or `Dashboard`
- Toggle between Dashboard, Board, Grid, and Learn views
- Edit a task priority or progress value
- Open two browser windows to show Socket.io updates
- Explain how the JSON file acts like a simple database

## Future Improvements

- Add real user authentication
- Replace JSON storage with SQLite
- Add real calendar import/export
- Add task creation forms for subtasks and comments
- Add sprint planning capacity rules
- Add permissions for Scrum Master, Product Owner, and Developer roles
