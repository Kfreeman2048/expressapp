const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const users = [{
    id: 1,
    name: "Jane Doe",
    age:"22",
    },
    {
    id: 2,
    name: "John Doe",
    age: "31",
}];

app.post('/create', (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: "Request body cannot be empty.",
        });
    };
    const { name, age } = req.body;
    if (!name || !age) {
        res.status(400).json({
            message: "Ensure you input both name and age.",
        });
    };
    const newUser = {
        id: users.length + 1,
        name,
        age,
    };
    try {
        users.push(newUser);
        res.status(201).json({
            message: "New user successfully created.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new user.",
        });
    };
});

app.get('/users', (req, res) => {
    try {
        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(500).json({
            message: "Faled to retrieve all users.",
        });
    };
});

app.get('/user/:userID', (req, res) => {
});
app.put('/user/:userID', (req, res) => {
});
app.delete('/delete/:userID', (req, res) => {
});
app.delete('/users', (req, res) => {
});
