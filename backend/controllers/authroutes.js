
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models2');
const Todo = require('../models');
const cron = require('node-cron');
const router = express.Router();
const verify = require('../middleware/auth');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


router.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Ready:", success);
  }
})

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Our App!',
    text: `Hi,${name}
    \nThank you for signing in Just Belive in us and you will exceed!
   `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }

}

router.post('/register', async (req, res) => {
  const { name, email, password, role, createdby } = req.body;
  const userId = uuidv4();

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, id: userId, role: role || "user", createdby });
    await user.save();
    sendWelcomeEmail(email, name);
    return res.send({ message: "User registered successfully" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ name: user.name, id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "24h" });


    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict'
    }).send({
      message: "Logged in successfully",
      token: token,
      role: user.role,
    });

    console.log("cookies", req.cookies)

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

router.get('/view/:id', verify, async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    const viewTasks = await Todo.find({ userId: targetId });

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
    console.log(task);
    res.send(task);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Task not Counted");
  }
});

router.get('/hello', async (req, res) => {

  const Id = req.cookies.userId;
  console.log("Fetching tasks for user ID:", Id);

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

    const user_tasks = tasks.filter((u) => u.userId === Id);
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

router.post('/generate-otp', async (req, res) => {
  const { email } = req.body;

  const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  try {
    await User.findOneAndUpdate({ email: email }, { otp: otp })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP Connection Error:", error);
      } else {
        console.log("SMTP Ready:", success);
      }
    })


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`
    });

    res.status(200).json('OTP sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }

});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otp_match = await User.findOne({ email, otp });
    console.log(otp_match);

    if (otp_match) {
      console.log("otp verified succesfully");
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      console.log("y");
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
});






// router.post('/schedule', async (req, res) => {
//   try {
//     const { deadline, email } = req.body;
//     const task = await Todo.findOne({ deadline: deadline });
//     const user = await User.findOne({ email: email })
//     if (!task || !user) {
//       return res.status(404).json({ message: 'Task or User not found' });
//     }

//     const currentDate = new Date().toLocaleDateString();

//     if ((task.deadline) < currentDate) {
//       let mailTransporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       let mailDetails = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Deadline of the Task to be completed",
//         text: "Hey, your deadline to complete the task is over. Please delete the task soon.",
//       };

//       mailTransporter.sendMail(mailDetails, function (err, data) {
//         if (err) {
//           console.log("Error Occurs", err);
//           return res.status(500).json({ message: 'Error sending email', error: err });
//         } else {
//           console.log("Email sent successfully");
//           return res.status(200).json({ message: 'Email sent successfully' });
//         }
//       });
//     } else {
//       return res.status(200).json({ message: 'Deadline has not yet passed' });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: 'Server Error', error });
//   }
// });


module.exports = router;