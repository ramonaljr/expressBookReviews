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

// Task 10: Get the book list available in the shop using async-await
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getAllBooks();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using async-await
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ message: "Book not found" });
    }
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json(error);
  }
});

// Task 12: Get book details based on author using async-await
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let matchingBooks = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        matchingBooks[isbn] = books[isbn];
      }
    });

    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ message: "No books found by this author" });
    }
  });
};

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = await getBooksByAuthor(author);
    res.send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    res.status(404).json(error);
  }
});

// Task 13: Get all books based on title using async-await
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    let matchingBooks = {};
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        matchingBooks[isbn] = books[isbn];
      }
    });

    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ message: "No books found with this title" });
    }
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = await getBooksByTitle(title);
    res.send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    res.status(404).json(error);
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
