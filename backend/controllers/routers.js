const express = require('express');
const Todo = require('../models');
const db = require('../dbconfig');
const verify = require('../middleware/auth');
const router = express.Router();

db;

router.get('/', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Todo.find({ userId: userId });
        return res.send(tasks);
    } catch (err) {
        console.error("Error while Getting Tasks:", err);
        return res.status(400).send("Error Fetching Tasks");
    }
});

router.post('/', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, name, description, createdAt, deadline, completed } = req.body;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        console.log(req.body);

        const new_task = new Todo({
            id,
            name,
            description,
            createdAt: createdAt ? new Date(createdAt).toDateString() : new Date().toLocaleDateString("en-US", options),
            deadline: deadline ? new Date(deadline).toDateString() : new Date().toLocaleDateString("en-US", options),
            completed,
            userId
        });

        console.log(new_task);

        const result = await new_task.save();
        console.log("Task Saved");

        res.send(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(400).send("Task not saved");
    }
});

router.put("/:id", verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const { name, description, completed, deadline } = req.body;

        console.log(name + " " + id);

        const updatedTask = await Todo.findOneAndUpdate(
            { id: id, userId: userId },
            {
                name,
                description,
                deadline: new Date(deadline).toDateString(),
                completed
            },
            { new: true }
        );

        if (!updatedTask) {
            console.log("Task not found");
            return res.status(404).json({ error: "Task not found" });
        }
        console.log("Task Updated Successfully");
        return res.status(200).json({ message: "Task Updated Successfully", updatedTask });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", verify, async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const deletedTask = await Todo.findOneAndDelete({ id: id, userId: userId });

        if (!deletedTask) {
            console.log("Delete Failed");
            return res.status(404).json({ error: "Task Not Found" });
        }

        return res.status(200).json({ message: "Task Deleted Successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;