const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISN from URL
  const book = books[isbn]; // Look up the book

  if (book) {
    res.send(JSON.stringify(book, null, 4)); // Book found
  } else {
    res.status(404).json({ message: "Book not found" }) // Book not found
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author // Get author from URL
  let matchingBooks = {}; // Store matching books

  // Loop through all books
  Object.keys(books).forEach((isbn) => {
    // isbn will be "1", "2", "3", etc.
    let book = books[isbn]; // Get the actual book object

    // Check if this book's aauthor matches
    if (book.author === author) {
      matchingBooks[isbn] = book; // Add to results
    }
  });

  // Return results or error
  if (Object.keys(matchingBooks).length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = {};

  // Loop through all books
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  // Return results or error
  if (Object.keys(matchingBooks).length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
