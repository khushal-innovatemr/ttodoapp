
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models2');
const Todo = require('../models');
const router = express.Router();
const verify = require('../middleware/auth');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


router.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));


router.post('/register', async (req, res) => {
    const {name, email, password, role, createdby } = req.body;
    const userId = uuidv4();

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send({ error: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({name, email, password: hashedPassword, id: userId, role: role || "user", createdby });
        await user.save();
        
        return res.send({ message: "User registered successfully"});
        
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});


router.post('/login', async (req, res) => {
    const {email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({name:user.name, id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "24h" });
        
        res.cookie('userId', user.id, { 
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
            // secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict' 
          }).send({
            message: "Logged in successfully",
            token: token,
            role:user.role,
        });
        console.log("cookies",req.cookies)
        
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post('/login/add', verify, async (req, res) => {
    if (req.user.IsAdmin) {
        res.send({
            message: "Add button displayed to redirect to the register page to add users"
        });
    } else {
        res.status(403).send({ error: "Access denied" });
    } 
});

router.get('/login/users', verify, async (req, res) => {
    if (req.user.role === 'admin') {
        try {
            const users = await User.find({ role: { $in: ['user', 'manager'] } }, 'name id email role createdby');
            return res.send(users);
        } catch (err) {
            console.error("Fetching users error:", err);
            res.status(500).send({ error: "Server Error" });
        }
    } else {
        res.status(403).send({ error: "Access denied" });
    }
});

router.get('/view/:id', verify, async(req, res) => {
    try {
        const userId = req.user.id;
        const targetId = req.params.id;
        
        const viewTasks = await Todo.find({ userId:targetId });
        
        if (!viewTasks || viewTasks.length === 0) {
            return res.status(203).json({ message: "No tasks found for this user" });
        }
        
        return res.json(viewTasks);
    } catch (err) {
        console.error("View tasks error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
});


router.delete('/login/delete/:id', verify, async (req, res) => {
    const userId = req.params.id;  
    console.log("Attempting to delete user with ID:", userId);
    
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Only admins can delete users." });
        }
        
        const user = await User.findOneAndDelete({ id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await Todo.deleteMany({ userId: userId });
        
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Deleting user error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get('/completed', async (req, res) => {
  try {
    const task = await Todo.aggregate([
      {
        $facet: {
          completedTasks: [
            {
              $match: {
                completed: true,
              },
            },
            {
              $count: "completedCount",
            },
          ],
          pendingTasks: [
            {
              $match: {
                completed: false,
              },
            },
            {
              $count: "pendingCount",
            },
          ],
        },
      },
      {
        $project: {
          completedCount: { $arrayElemAt: ["$completedTasks.completedCount", 0] },
          pendingCount: { $arrayElemAt: ["$pendingTasks.pendingCount", 0] },
        },
      },
    ]);
    res.send(task);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Task not Counted");
  }
});

router.get('/hello', async (req, res) => {
  
  const Id  = req.cookies.userId;
  console.log("Fetching tasks for user ID:",Id);
   
  try {
    const tasks = await Todo.aggregate([
      {
        $group: {
          _id: "$userId",
          tasks: {
            $push: {
              _id: "$_id",
              completed: "$completed",
            },
          },
        },
      },
      {
        $project: {
          completedCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: {
                  $eq: ["$$task.completed", true],
                },
              },
            },
          },
          pendingCount: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: {
                  $eq: ["$$task.completed", false],
                },
              },
            },
          },
          _id: 0,  
          userId: "$_id",
        },
      },
    ]);

    const user_tasks =tasks.filter((u) => u.userId === Id);
    res.send(user_tasks);

  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Task not Counted");
  }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;