const express = require("express");
const app = express.Router();
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");

/**
 * Route: /books/issued
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: None
 */

app.get("/issued", (req, res) => {
    console.log("working");
    let issuedBookList =[];
     users.map((eachUser) => {
        if(eachUser.issuedBook){
            const bookId = eachUser.issuedBook;
            books.map((eachBook) => {
                if(eachBook.id === bookId){
                    console.log(eachBook);
                    issuedBookList.push(eachBook);
                }
            })
        }
    });

    if(!issuedBookList){
        return res.status(404).json({
            success : false,
            message : "no books are issued yet.."
        });
    }

    return res.status(200).json({
        success : true,
        data : issuedBookList
    });
});


/**
 * Route: /books
 * Method: GET
 * Description: Getting all books
 * Access: Public
 * Parameters: None
 */

app.get("/", (req, res) => {
    res.status(200).json({
        success : true,
        data: books
    });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get books by their id
 * Access: Public
 * Parameters: Id
 */


app.get("/:id", (req, res) => {
    const {id} = req.params;
    const isBookExtists = books.find((each) => each.id === id);
    if(!isBookExtists){
        return res.status(404).json({
            success : false,
            message : "book not found"
        });
    }
    return res.status(200).json({
        success : true,
        message : "Book Found.",
        data : isBookExtists
    });
});


/**
 * Route:  Create/Add a new book
 * Method: POST
 * Description: Add New Book
 * Access: Public
 * Parameters: none
 */

app.post("/", (req, res) => {
    const {data} = req.body;
    console.log(data);
    const isBookExtists = books.find((each) => each.id === data.id);
    if(isBookExtists){
        return res.status(404).json({
            success : false,
            message : "Book id is already in use"
        });
    }

    books.push({
        ... data
    });
    return res.status(201).json({
        success: true,
        message : "Book added successfully",
        data : books
    });
});

/**
 * Route:  UPDATE BOOK  
 * Method: PUT
 * Description: UPDATING BOOK BY ITS ID
 * Access: Public
 * Parameters: ID
 */

app.put("/:id", (req, res) => {
    const {id} = req.params;
    const {data} = req.body;
    console.log(data);
    const isBookExtists = books.find((each) => each.id === id);
    if(!isBookExtists){
        return res.status(404).json({
            success : false,
            message : "Book not found"
        });
    }

    const updatedBook = books.map((each) => {
        if(each.id === id){
            return {
                ... each,
                ... data
            };
        }
        return each;
    });

    res.status(200).json({
        success : true,
        message : "Book updated Successfully",
        data : updatedBook
    });
});




module.exports = app;