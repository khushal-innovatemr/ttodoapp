const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./controllers/routers');
const authRouter = require('./controllers/authroutes');
const cors = require('cors');
const cron = require('node-cron');
const Todo = require('./models');
const User = require('./models2');
const nodemailer = require('nodemailer')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001

// app.use(cors())
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,

}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.use('/tasks', router);
app.use('/auth', authRouter);


// app.on('error', (err) => {
//     console.error(`Error during startup: ${err.message}`);
// });

cron.schedule("*/1 * * * *", function () {
    sendDeadlineEmails();
});

async function sendDeadlineEmails() {
    try {
      const tasks = await Todo.find();
      const currentDate = new Date();
  
      for (const task of tasks) {
        if(!task.completed){
            if (new Date(task.deadline) < currentDate) {
                const user = await User.findOne({ id: task.userId });  
                if (user) {
                    let mailTransporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });
                    let mailDetails = {
                        from: process.env.EMAIL_USER,
                        to: user.email,
                        subject: "Task Deadline Exceeded",
                        text: `Hey,
                        
                        Your deadline to complete the task is over. Please delete the task soon.
                        
                        Task Details:
                        - Task ID: ${task.id}
                        - Task Description: ${task.description}
                        - User ID: ${task.userId}
                        
                        Best regards,
                        Admin`,
                    };
                    await mailTransporter.sendMail(mailDetails);
                    console.log("Email sent successfully to", user.email);
                }
            }
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

app.listen(PORT, () => {
    console.log(`App has started on port ${PORT}`);
});