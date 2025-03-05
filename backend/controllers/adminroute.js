const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models2');
const router = express.Router();
const verify = require('../middleware/auth')


router.post('/login/add',verify,async(req,res) => {

})