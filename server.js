const express = require("express");
const app = express();
const PORT = 8080;
const db = require('./db_connect.js');
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const users = [{
    id: 1,
    name: "Jane Doe",
    age:"22"
    },
    {
    id: 2,
    name: "John Doe",
    age: "31"
}];

app.post('/create', async (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: "Request body cannot be empty.",
        });
    }
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({
            message: "Ensure you input both name and age.",
        });
    }
    try {
        let newUserId = await db.createUser(name, age);
        res.status(201).json({
            message: "New user successfully created.",
            newUserId,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new user.",
        });
    }
});

app.get('/users', async (req, res) => {
    try {
        res.status(200).json({
            users: await db.getUsers(),
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve all users.",
        });
    }
});

app.get('/users/:userID', async (req, res) => {
    const id = parseInt(req.params.userID);
    try {
        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid user id.",
            });
        }
        let usersFromDb = await db.getUserById(id);
        if (usersFromDb.length === 1) {
            return res.status(200).json({
                user: usersFromDb[0],
            });
        }
        else {
            return res.status(404).json({
                message: "User not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user.",
        });
    }
});

app.put('/users/:userID', async (req, res) => {
    const id = parseInt(req.params.userID);
    const { name, age } = req.body;
    try {
        if (!Object.keys(req.body).length) {
            return res.status(400).json({
                message: "Request body cannot be empty.",
            });
        }
        if (!name && !age) {
            return res.status(400).json({
                message: "Name or age required.",
            });
        }
        let dbReturn = await db.updateUser(id, name, age) 
        if (dbReturn.affectedRows == 0) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        if (dbReturn.affectedRows == 1) {
            return res.status(200).json({
            message: "Successfully updated user.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update user.",
        });
    }
});

app.delete('/delete/:userID', async (req, res) => {
    const id = parseInt(req.params.userID);
    try {
        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid user id.",
            });
        }
        let dbReturn = await db.deleteUser(id)
        if (dbReturn.affectedRows === 1) {
            return res.status(200).json({
                message: "Successfully deleted user.",
            });
        }
        else {
            return res.status(404).json({
                message: "User not found.",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user.",
        });
    }
});

app.delete('/users', (req, res) => {
    try {
        users.splice(0, users.length);
        res.status(200).json({
            message: "Successfully deleted all users.",
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete users.",
        });
    }
});
