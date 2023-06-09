const express = require('express');
let books = require("./booksdb.js");
const { ChatCompletionResponseMessageRoleEnum } = require('openai');
const { resolve } = require('path');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/', function(req,res){
  const bookList = JSON.stringify(books, null, 2);
  return res.status(200).send(bookList);
});

// Using Promises and Callbacks
/*
public_users.get('/',(req, res)=>{
  const getBooksList = new Promise((resolve, reject)=>{
    setTimeout(()=>{
      const bookList = JSON.stringify(books,null,2);
      resolve(bookList)
    },1000)
  });
  getBooksList
    .then(bookList=>{
      return res.status(200).send(bookList)
    })
    .catch(error=>{
      return res.status(500).send('Error Occurred')
    })
})
*/

public_users.post("/register", (req,res) => {
  username = req.body.username
  password = req.body.password
  currentUser = {
    username: username,
    password: password
  }
  if(username!="" && password!=""){
    for(let obj of users){
      if(obj.username === username){
        return res.status(409).json({message:`User with username: ${username} already exist`})
      }
    }
    users.push(currentUser)
    return res.status(200).json({message: `${username} Registered Successfully`})
  }
  if(username.trim() == "" || password.trim() == ""){
    return res.status(300).json({message: "Password or Username can't be Empty"});
  }
});

// Get the book list available in the shop
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const matchingBooks = []
  for(const key in books){
    if(books[key].author === author){
      matchingBooks.push(`${author}:${ books[key].title}`)
    }
  }
  return res.status(200).json(matchingBooks)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
  const { isbn } = req.params;
  const getBookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookDetails = books[isbn[1]];
      resolve(bookDetails);
    }, 1000);
  });

  getBookDetails
    .then(bookDetails => {
      return res.status(200).json(bookDetails);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error while getting book details" });
    });
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const getBookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
      for(const key in books){
        if(books[key]['author'] == author){
          const bookDetails = books[key]
          resolve(bookDetails);
        }
      }
    }, 2000);
  });

  getBookDetails
    .then(bookDetails => {
      return res.status(200).json(bookDetails);
    })
    .catch(error => {
      return res.status(500).json({ message: "Error while getting book details" });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const matchingBooks = []
  for(const key in books){
    if(books[key].title == title){
      matchingBooks.push(`${books[key].author}:${ books[key].title}`)
    }
  }
  return res.status(200).json(matchingBooks)
});

// Using Promises and Callbacks
/*
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const matchingBooks = []
  const getBookDetails = new Promise((resolve, reject)=>{
    setTimeout(() => {
      for(const key in books){
        if(books[key].title == title){
          matchingBooks.push(`${books[key].author}:${ books[key].title}`)
        }
      }
      resolve(matchingBooks)
    }, 2000);
  });

  getBookDetails
    .then(matchingBooks=>{
      return res.status(200).json(matchingBooks)
    })
    .catch(error=>{
      return res.status.json({message:"Error while fetching books details"})
    })
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  for (const key in books){
    if(key === isbn){
      return res.status(200).json(books[key]);
    }
  }
});

module.exports.general = public_users;
