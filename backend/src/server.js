import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { setServers } from "node:dns/promises";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api/tasks", taskRoutes);

setServers(["1.1.1.1", "8.8.8.8"]);
connectDB().then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log('listening on port', process.env.PORT || 3001);
    })
})


