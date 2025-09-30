const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Please provide username and password."});
});

// Get the book list available in the shop - Synchronous version
/*
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});
*/

// Task 10: Get the book list available in the shop using Promises
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(books);
    });

    get_books.then((booklist) => res.send(JSON.stringify(booklist, null, 4)));
});


// Get book details based on ISBN - Synchronous version
/*
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
 });
*/

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_book_details = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({status:404, message:`Book with ISBN ${isbn} not found`});
        }
    });

    get_book_details
        .then(result => res.send(result))
        .catch(error => res.status(error.status).json(error));
 });
  
// Get book details based on author - Synchronous version
/*
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const authorBooks = [];
    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.author === author) {
                authorBooks.push(book);
            }
        }
    }

    if (authorBooks.length > 0) {
        return res.send(authorBooks);
    }
  return res.status(404).json({message: "No books found by this author"});
});
*/

// Task 12: Get book details based on author using Promises
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const get_books_by_author = new Promise((resolve, reject) => {
        const authorBooks = [];
        for (const bookId in books) {
            if (books.hasOwnProperty(bookId)) {
                const book = books[bookId];
                if (book.author === author) {
                    authorBooks.push(book);
                }
            }
        }
        if (authorBooks.length > 0) {
            resolve(authorBooks);
        } else {
            reject({status:404, message:`No books found by author ${author}`});
        }
    });

    get_books_by_author
        .then(result => res.send(result))
        .catch(error => res.status(error.status).json(error));
});

// Get all books based on title - Synchronous version
/*
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const titleBooks = [];
    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.title === title) {
                titleBooks.push(book);
            }
        }
    }
    if(titleBooks.length > 0) {
        return res.send(titleBooks);
    }

  return res.status(404).json({message: "No books found with this title"});
});
*/

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const get_books_by_title = new Promise((resolve, reject) => {
        const titleBooks = [];
        for (const bookId in books) {
            if (books.hasOwnProperty(bookId)) {
                const book = books[bookId];
                if (book.title === title) {
                    titleBooks.push(book);
                }
            }
        }
        if (titleBooks.length > 0) {
            resolve(titleBooks);
        } else {
            reject({status:404, message:`No books found with title ${title}`});
        }
    });

    get_books_by_title
        .then(result => res.send(result))
        .catch(error => res.status(error.status).json(error));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      return res.send(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;

