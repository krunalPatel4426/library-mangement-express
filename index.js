const express = require("express");
const app = express();
app.use(express.json());
const PORT = 8081;
const {users} = require("./data/users.json");


// root-users = /users
app.get("/users", (req, res) => {
    res.status(200).json({
        "users": users,
    });
});


//home
app.get("/", (req, res)=>{
    res.status(200).json({
        message: "server intialized",
    })
});
app.get("*", (req, res) => {
    res.status(404).json({
        message: "Page not found",
    });
});
app.listen(PORT, ()=>{
    console.log("Server intialized at port : ", PORT);
});