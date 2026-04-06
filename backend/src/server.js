import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import { setServers } from "node:dns/promises";
import path from "path";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

setServers(["1.1.1.1", "8.8.8.8"]);
connectDB().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("listening on port", process.env.PORT || 3001);
  });
});
