const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./controllers/routers');
const authRouter = require('./controllers/authroutes');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const app = express();
const PORT = process.env.PORT||3001

app.use(cors({
    origin: 'https://emp-rust-three.vercel.app',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token, x-refresh-token, _id',
    credentials: true
}));


app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

app.use(bodyParser.json());
app.use(cookieParser());


app.use('/tasks', router);
app.use('/auth', authRouter);


app.on('error', (err) => {
    console.error(`Error during startup: ${err.message}`);
});

app.listen(PORT, () => {
    console.log(`App has started on port ${PORT}`);
});
