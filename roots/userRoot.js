const express = require("express");
const {users} = require("../data/users.json");
const app = express.Router();

/**
 * Route: /
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: None
 */
// root-users = /users
app.get("/", (req, res) => {
    res.status(200).json({
        "users": users,
    });
});

/**
 * Route: /:id
 * Method: GET
 * Description: Get single user by their id
 * Access: Public
 * Parameters: Id
 */
app.get("/:id", (req, res) => {
    const {id} = req.params;
    // console.log(req.params);
    const userData = users.find((userId) => userId.id === id);
    if(!userData){
        return res.status(404).json({
            success : false,
            message : "User Not Found."
        });
    }
    return res.status(200).json({
        success : true,
        message : "User found.",
        data : userData
    });
});

/**
 * Route: /
 * Method: POST
 * Description: Creating a new user
 * Access: Public
 * Parameters: None
 */

app.post("/", (req, res) => {
    const {id, name, username, email, subscriptionType, subscriptionDate} = req.body.data;
    console.log(req.body.data)
    const user = users.find((each) => each.id === id);
    if(user){
        return res.status(404).json({
            success : false,
            message : "UserId already exists."
        });
    }

    users.push({
        id, name, username, email, subscriptionType, subscriptionDate
    });
    return res.status(201).json({
        success : true,
        message : "User added succesfully",
        data: users
    });
});

/**
 * Route: /:id
 * Method: PUT
 * Description: Updating a user by their id
 * Access: Public
 * Parameters: ID
 */

app.put("/:id", (req, res) => {
    const {id} = req.params;
    const {data} = req.body;
    const isUserExists = users.find((userId) => userId.id === id);
    if(!isUserExists){
        return res.status(404).json({
            success : false,
            message : "user not found."
        });
    }
    
    const updatedUser = users.map((each) => {
        if(each.id === id){
            console.log(each);
            console.log(data);
            return {
                ... each,
                ... data
            };
        }
        return each;
    });

    res.status(200).json({
        success : true,
        message : "User data updated",
        data : updatedUser
    });
});

/**
 * Route: /:id
 * Method: DELETE
 * Description: Deleting a user by their id
 * Access: Public
 * Parameters: ID
 */

app.delete("/:id", (req, res) => {
    const {id} = req.params;
    const isUserExists = users.find((each) => each.id === id);
    if(!isUserExists){
        return res.status(404).json({
            success: false,
            message : "user not found"
        });
    }
    const index = users.indexOf(isUserExists);
    users.splice(index, 1);

    return res.status(200).json({
        success : true,
        message : "User deleted successfully",
        data : users
    });
});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user Subscription Details
 * Access: Public
 * Parameters: ID
 */

app.get("/subscription-details/:id", (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            success : false,
            message : "User Not Found"
        });
    }
    const getDays = (data = "") => {
        let date;
        if(data == ""){
            date = new Date();
        }else{
            date = new Date(data);
        }
        return Math.floor(date/(1000*60*60*24));
    };

    const getSubscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date += 30;
        }else if(user.subscriptionType === "Standard"){
            date += 180;
        }else{
            date += 365;
        }
        return date;
    };

    let returnDate = getDays(user.returnDate);
    let currentDate = getDays();
    let subscriptionDate = getDays(user.subscriptionDate);
    let subscriptionExpiration = getSubscriptionType(subscriptionDate);

    const data = {
        ... user,
        isSubscriptionExpired : subscriptionExpiration < currentDate,
        daysLeftForExpiration : subscriptionExpiration < currentDate ? 0 : subscriptionExpiration - currentDate,
        fine : returnDate < currentDate ? subscriptionDate < currentDate ? 100 : 50 : 0
    };

    return res.status(200).json({
        success : true,
        message : "user's subscription details",
        data : data
    });
});

module.exports = app;