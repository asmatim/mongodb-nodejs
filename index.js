const express = require('express');
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const users = require("./api/users");

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Register user
app.post('/api/auth/register',
    // request validation
    body('email').isEmail()
    , body('firstname').isLength({ min: 1 })
    , body('lastname').isLength({ min: 1 })
    , body('password').isLength({ min: 5 })
    // Request handler
    , users.register);


// login user
app.post('/api/auth/login'
    // request validation
    , body('email').isEmail()
    , body('password').isLength({ min: 5 })
    // Request handler
    , users.login);


// get user profile
app.get('/api/user/profile', users.profile);


// edit user info
app.put('/api/user/edit', users.edit);


// edit user password
app.put('/api/user/edit-password'
    // request validation
    , body('password').isLength({ min: 5 })
    // Request handler
    , users.editPassword);

// edit user phone
app.put('/api/user/edit-phone', users.editPhone);

// edit user email
app.put('/api/user/edit-email'
    ,// request validation
    body('email').isEmail()
    // Request handler
    , users.editEmail);


// delete user
app.delete('/api/user/delete', users.deleteUser);

// logout user
app.delete('/api/auth/logout', users.logout);


const start = async () => {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/archiweb"
        ).catch(error => console.error(err.reason));
        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();

