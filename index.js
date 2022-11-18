const express = require('express');
const mongoose = require("mongoose");
const users = require("./api/users");

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/auth/register', users.register);

app.post('/api/auth/login', users.login);

app.get('/api/user/profile', users.profile);



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

