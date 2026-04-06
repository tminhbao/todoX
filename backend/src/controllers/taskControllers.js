import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
    const { filter = 'today' } = req.query;
    const now = new Date();
    let startDate;
    switch (filter) {
        case 'today': {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        }
        case 'week': {
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = newDate(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        }
        case 'month': {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        default:
            startDate = null;
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};

    try {
        const result = await Task.aggregate([
            {
                $match: query
            },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                    completedCount: [{ $match: { status: "completed" } }, { $count: "count" }]
                }
            }
        ])
        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completedCount = result[0].completedCount[0]?.count || 0;
        res.status(200).json({ tasks, activeCount, completedCount });
    } catch (error) {
        console.log("Error when call getAllTasks", error);
        res.status(500).json({ message: "Error System" })
    }
}

export const createNewTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.log("Error when call createNewTask", error);
        res.status(500).json({ message: "Error System" })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            { new: true } // return the value AFTER update
        )
        if (!updateTask) {
            return res.status(404).json({ message: 'Task does not exist' })
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.log("Error when call updateTask", error);
        res.status(500).json({ message: "Error System" })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deleteTask) {
            return res.status(404).json({ message: 'Task does not exist' })
        }
        res.status(200).json(deletedTask);
    } catch (error) {
        console.log("Error when call deleteTask", error);
        res.status(500).json({ message: "Error System" })
    }
}