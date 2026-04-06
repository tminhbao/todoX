import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }));
app.use("/api/tasks", taskRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log('listening on port', process.env.PORT || 3001);
    })
})


