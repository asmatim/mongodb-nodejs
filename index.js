const express = require('express');
const mongoose = require("mongoose");
const users = require("./api/users");

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register user
app.post('/api/auth/register', users.register);


// login user
app.post('/api/auth/login', users.login);


// get user profile
app.get('/api/user/profile', users.profile);


// edit user info
app.put('/api/user/edit', users.edit);


// edit user password
app.put('/api/user/edit-password', users.editPassword);

// edit user phone
app.put('/api/user/edit-phone', users.editPhone);

// edit user email
app.put('/api/user/edit-email', users.editEmail);


// delete user
app.delete('/api/user/delete', users.deleteUser);


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

