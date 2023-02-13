import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.select("tasks", id);

      if (!task) {
        return res.writeHead(400).end("id not found");
      } else {
        return res.end(JSON.stringify(task));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end("Missing title");
      } else if (!description) {
        return res.writeHead(400).end("Missing description");
      } else {
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: Date(),
        };

        database.insert("tasks", task);

        return res.writeHead(201).end();
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res.writeHead(400).end("Missing title");
      } else if (!description) {
        return res.writeHead(400).end("Missing description");
      } else {
        const response = database.update("tasks", id, {
          title,
          description,
          updated_at: Date(),
        });

        if (response === -1) return res.writeHead(400).end("id not found");

        return res.writeHead(204).end();
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const response = database.update("tasks", id, {
        completed_at: Date(),
        updated_at: Date(),
      });

      if (response === -1) return res.writeHead(400).end("id not found");

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const response = database.delete("tasks", id);

      if (response === -1) return res.writeHead(400).end("id not found");

      return res.writeHead(204).end();
    },
  },
];
