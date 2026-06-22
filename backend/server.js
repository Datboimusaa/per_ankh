import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { PORT, FRONTEND_URL } from "./src/config/env.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import workspaceRoutes from "./src/routes/workspace.routes.js";
import memberRoutes from "./src/routes/members.routes.js";
import boardRoutes from "./src/routes/board.routes.js";
import columnRoutes from "./src/routes/columns.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import noteRoutes from "./src/routes/note.routes.js";
import assigneeRoutes from "./src/routes/assignee.routes.js";
import fileRoutes from "./src/routes/file.routes.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

/* MIDDLEWARES */
app.use(express.json());
app.use(
  cors({
    origin: `${FRONTEND_URL}`,
    credentials: true,
  }),
);
app.use(cookieParser());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/workspaces/:workspaceId/members", memberRoutes);
app.use("/api/workspaces/:workspaceId/boards", boardRoutes);
app.use("/api/workspaces/:workspaceId/boards/:boardId/columns", columnRoutes);
app.use(
  "/api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks",
  taskRoutes,
);
app.use(
  "/api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/comments",
  commentRoutes,
);
app.use(
  "/api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/notes",
  noteRoutes,
);
app.use(
  "/api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/assignees",
  assigneeRoutes,
);
app.use(
  "/api/workspaces/:workspaceId/boards/:boardId/columns/:columnId/tasks/:taskId/files",
  fileRoutes,
);

/* ERROR MIDDLEWARE */
app.use(errorMiddleware);

/* SOCKET IO CONFIG */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${FRONTEND_URL}`,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`Client connected to WebSocket stream: ${socket.id}`);

  socket.on("join_board", (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`User joined isolated board stream room: board:${boardId}`);
  });

  socket.on("leave_board", (boardId) => {
    socket.leave(`board:${boardId}`);
    console.log(`User left board stream room: board:${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected from stream: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
