const express = require("express");
const app = express();
app.use(express.json());
const PORT = 8081;
const {users} = require("./data/users.json");
const user = require("./roots/userRoot.js");
const book = require("./roots/bookRoot.js");

app.use("/users", user);
app.use("/books", book);
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