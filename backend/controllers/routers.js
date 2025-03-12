const express = require('express');
const Todo = require('../models');
const User = require('../models2');
const db = require('../dbconfig');
const verify = require('../middleware/auth');
const role_middleware = require('../middleware/role_auth');
const router = express.Router();
const app = express();
app.use(express.json())

db;

router.get('/', verify, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.user.IsAdmin);
        let tasks;
        if (req.user.role === "manager") {
            tasks = await Todo.find()
        }
        else {
            tasks = await Todo.find({ userId: userId });
        }
        return res.send(tasks);

    } catch (err) {
        console.error("Error while Getting Tasks:", err);
        return res.status(400).send("Error Fetching Tasks");
    }
});

router.post('/', verify, role_middleware(["admin", "manager", "user"]), async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, name, description, createdAt, deadline, completed } = req.body;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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


router.put("/:id", verify,role_middleware(["manager","admin","user"]),async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, completed, deadline } = req.body;

        console.log(name + " " + id);

        const updatedTask = await Todo.findOneAndUpdate(
            { id: id},
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

router.delete("/:id", verify, role_middleware(["manager","admin"]), async (req, res) => {
    try {
        // const userId = req.user.id;
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



// router.get('/tasks', verify, async (req, res) => {
//     try {
//       const userId = req.  
//       const tasks = await Todo.find({ userId: userId });
//       if (tasks.length === 0) {
//         return res.status(404).json({ message: 'No tasks found for this user.' });
//       }
//       return res.json(tasks);
//     } catch (err) {
//       console.error('Error while getting tasks:', err);
//       return res.status(500).json({ error: 'Error fetching tasks' });
//     }
//   });

module.exports = router;
// const role = req.user.isAdmin ? role = {id} :role = {id,userId};