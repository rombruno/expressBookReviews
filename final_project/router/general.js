const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn",function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book) {
        res.send(JSON.stringify(book,null,4)); 
    } else {
        res.send("Unable to find book!");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const books_keys = Object.keys(books);
    let matched_book = "";
    books_keys.forEach((key) => {
        let book = books[key];
        if(book["author"] === author) {
            matched_book += '\n' + JSON.stringify(book,null,4);
        }
    })
    if(matched_book === "") {
       matched_book = "Unable to find author " + author; 
    }
    res.send(matched_book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const books_keys = Object.keys(books);
    let matched_book = "";
    books_keys.forEach((key) => {
        let book = books[key];
        if(book["title"].toLowerCase().indexOf(title) >= 0) {
            matched_book += '\n' + JSON.stringify(book,null,4);
        }
    })
    if(matched_book === "") {
        matched_book = "Unable to find title " + title; 
     }
    res.send(matched_book); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book) {
        let book_reviews = book["reviews"];
        res.send(JSON.stringify(book_reviews,null,4)); 
    } else {
        res.send("Unable to find book!");
    }
});

module.exports.general = public_users;
