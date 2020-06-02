// import express from 'express'; // ES2015 Modules
const express = require("express"); // CommonJS Modules
const cors = require("cors");

const server = express();

var shortid = require('shortid')

server.use(express.json()); // teaches express how to read JSON from the body
server.use(cors());

let users = [
    {
        id: 1,
        name: "Michael",
        bio: "A full stack web developer."
    },
    {
        id: 2,
        name: "mike",
        bio: "A full stack web developer."
    }
]

server.get("/", (req, res) => {
    res.json({ api: "Up and running!" });
});


server.post("/api/users", (req, res) => {
    // adds a user to user array
    const newUser = req.body;
    newUser.id = shortid.generate();
    
    // If username or bio is not entered or null return error code 400
    if (newUser.name === null || newUser.bio === null || newUser.name === "" || newUser.bio === "") {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    // If error while saving newUser error code 500
    else if (!newUser) {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
    // if newUser is saved successfully return code 201 and new object
    else {
        users.push(newUser);
        
        res.status(201).json(newUser);
    }
    
});

server.get("/api/users", (req, res) => {
   // if there is an error retrieving users
    if (!users) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
     // returns an array of users (id, name, bio)
    else {
        res.json(users);
    }
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const thisUser = users.filter((user) => user.id == id);

    if(!thisUser){
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
    else if (!thisUser){
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
    else {
        res.status(200).json(thisUser)
    }
})

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const thisUser = users.filter(user => user.id == id);


    if(id === undefined){
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
    else if (!thisUser){
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
    else {
        users = users.filter(user => user.id !== id)
        res.status(200).json(thisUser)
    }
})

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const thisUser = req.body;

    thisUser.id = id;

    if(id === undefined){
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
    else if(thisUser.name === null || thisUser.bio === null || thisUser.name === "" || thisUser.bio === ""){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    else if (!thisUser){
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
    else {
        users = users.filter(user => user.id !==id)
        users.push(thisUser);
        res.status(200).json(thisUser)
    }
})

server.listen(4000, () => console.log("\nAPI running on port 8000\n"));
