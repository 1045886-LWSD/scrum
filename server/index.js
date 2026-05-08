import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "data.json");
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

async function readData() {
  // The JSON file works like a tiny classroom-friendly database.
  const file = await readFile(DATA_FILE, "utf8");
  return JSON.parse(file);
}

async function writeData(data) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function createActivity(message, type = "task") {
  return {
    id: `a-${Date.now()}`,
    message,
    type,
    time: "just now"
  };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "AgileFlow API" });
});

app.get("/api/data", async (req, res) => {
  res.json(await readData());
});

app.post("/api/tasks", async (req, res) => {
  // Create is one of the CRUD operations students can point to during the demo.
  const data = await readData();
  const task = {
    id: `task-${Date.now()}`,
    progress: 0,
    points: 3,
    comments: [],
    subtasks: [],
    attachments: [],
    updatedAt: new Date().toISOString(),
    ...req.body
  };
  data.tasks.unshift(task);
  data.activity.unshift(createActivity(`Created task "${task.title}"`, "create"));
  await writeData(data);
  io.emit("data:changed", data);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", async (req, res) => {
  // Updating a task also creates an activity item and broadcasts a real-time event.
  const data = await readData();
  const taskIndex = data.tasks.findIndex((task) => task.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const previous = data.tasks[taskIndex];
  const updated = {
    ...previous,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  data.tasks[taskIndex] = updated;
  const moved = previous.status !== updated.status;
  data.activity.unshift(
    createActivity(
      moved ? `Moved "${updated.title}" to ${updated.status}` : `Updated "${updated.title}"`,
      moved ? "move" : "update"
    )
  );

  await writeData(data);
  io.emit("data:changed", data);
  res.json(updated);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const data = await readData();
  const task = data.tasks.find((item) => item.id === req.params.id);
  data.tasks = data.tasks.filter((item) => item.id !== req.params.id);

  if (task) {
    data.activity.unshift(createActivity(`Deleted task "${task.title}"`, "delete"));
  }

  await writeData(data);
  io.emit("data:changed", data);
  res.status(204).end();
});

io.on("connection", (socket) => {
  socket.emit("notification", {
    title: "Connected",
    message: "Real-time Scrum updates are active."
  });
});

httpServer.listen(PORT, () => {
  console.log(`AgileFlow API running at http://localhost:${PORT}`);
});
