const express = require('express');
const Todo = require('../models'); 
const db = require('../dbconfig');
const router = express.Router();

db;

router.get('/', async (req, res) => {
    try {
        const tasks = await Todo.find();
        return res.send(tasks);
    } catch (err) {
        console.error("Error while Getting Tasks:", err);
        return  res.status(400).send("Error Fetching Tasks");
    }
});

router.post('/', async (req, res) => {
    try {
        
        const id = req.body.id;
        const name = req.body.name;
        const description = req.body.description;
        const createdAt = req.body.createdAt;
        const deadline = req.body.deadline;
        const completed = req.body.completed;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        console.log(req.body);

        const new_task = new Todo({ 
            id, 
            name, 
            description, 
            createdAt: createdAt ? new Date(createdAt).toDateString()
                                : new Date().toLocaleDateString("en-US", options), 
            deadline: deadline ? new Date(deadline).toDateString()
                                : new Date().toLocaleDateString("en-US", options), 
            completed 
        });
    
        console.log(new_task);
        
        const result = await new_task.save();
        console.log("Task Saved");
        
        res.send(result);
    } 
    catch (error) {
        console.error("Error:", error);
        res.status(400).send("Task not saved");
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, completed, deadline } = req.body;

        console.log(name + " " + id);

        const updatedTask = await Todo.findOneAndUpdate(
            { id: id },
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

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedTask = await Todo.findOneAndDelete({ id: id });

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