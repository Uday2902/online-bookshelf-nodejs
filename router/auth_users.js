const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const fs = require('fs')
const regd_users = express.Router();
const secret_key = "SECRET_KEY"

let users = [];

const isValid = (username)=>{ 
  if(username.trim()!=""){
    return true
  }
  return false
}

const authenticatedUser = (username,password)=>{ 
  if(isValid(username)){
    for(user of users){
      if(user.username === username && user.password === password){
        return true   
      }
    }
  }
  return flase
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if(authenticatedUser(req.body.username,req.body.password)){
    const payload = {
      username: username,
      password: password
    }
    const token = jwt.sign(payload,secret_key)
    return res.status(300).json({message: "Login Successfully & JWT created",token})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  console.log(isbn[1])
  // const { review } = req.query;
  // const { username } = req.body;
  const review = req.query.review
  const username = req.username // This username is not came in request but it is from middleware of index.js
  const mainFilePath = './booksdb.js'
  const fileContent = fs.readFileSync(mainFilePath,'utf-8')
  const code = new Function(`return ${fileContent}`)();
  let books = code.books

  for(const key in books){
    if(key == isbn[1]){
      books[key]["reviews"][username] = review
      const updatedFileContent = `const books = ${JSON.stringify(books,null,2)};\n\n${fileContent}`
      fs.writeFileSync(mainFilePath, updatedFileContent, 'utf8');
      return res.status(200).json({message: `Review of user ${username} is added/updated successfully : ${review}`})
    }
  }
  return res.status(200).json({ message: "Review added successfully", books});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const username = req.username;
  for(const key in books){
    if(isbn[1] == key){
      delete books[key]["reviews"][username]
      console.log(books)
      return res.status(200).json({message: `The review from user ${username} is deleted successfully`})
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;