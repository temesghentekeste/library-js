let localStorageItem = "myBooksLibrary";
let bookStatus = false;
const UITextAuthour = document.querySelector(".txt-author");
const UITextTitle = document.querySelector(".txt-title");
const UINumPages = document.querySelector(".num-pages");
const UIChKStatus = document.querySelector(".chk-status");
const UITableBody = document.querySelector(".table-body");
const UIBtnAddBook = document.querySelector(".btn-add-book");
const UIBtnToggleForm = document.querySelector(".btn-show-form");
const UIFormContainer = document.querySelector(".form-popup");

UIBtnAddBook.addEventListener("click", addBookToLibrary);
UIChKStatus.addEventListener("change", getStatus);
UITableBody.addEventListener("click", deleteEdit);

function Book(author, title, pages, status) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.status = status;
}

function addBookToLibrary(e) {
  e.preventDefault();
  console.log(UIChKStatus, UIChKStatus.value);

  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);

  const bookRow = document.createElement("tr");
  bookRow.classList.add("book");

  // New book item

  // Add ID to bookRow: newBook
  const books = getBooks();
  console.log(books);
  let id;
  if (books.length > 0) {
    id = books[books.length - 1].id + 1;
  } else {
    id = 1;
  }
  newBook.id = id;
  bookRow.setAttribute("id", id);
  // Author column
  const newBookAuthor = document.createElement("td");
  newBookAuthor.innerText = newBook.author;
  bookRow.appendChild(newBookAuthor);

  // Title column
  const newBookTitle = document.createElement("td");
  newBookTitle.innerText = newBook.title;
  bookRow.appendChild(newBookTitle);

  // Pages column
  const newBookPages = document.createElement("td");
  newBookPages.innerText = newBook.pages;
  bookRow.appendChild(newBookPages);

  // Status column
  const newBookStatus = document.createElement("td");
  newBookStatus.innerHTML = `${newBook.status ? "Read" : "Not Read"}`;
  bookRow.appendChild(newBookStatus);

  // Actions column
  const newBookActions = document.createElement("td");
  const deleteBook = document.createElement("button");
  deleteBook.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBook.classList.add("trash-btn");
  newBookActions.appendChild(deleteBook);
  bookRow.appendChild(newBookActions);

  // Save book to LS
  saveBookLS(newBook);
  // Append the row back to tbody
  UITableBody.appendChild(bookRow);
}

UIBtnToggleForm.addEventListener("click", (e) => {
  UIFormContainer.classList.toggle("hidden");
});

function getStatus(event) {
  if (event.target.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
    console.log(event.target.value, bookStatus);
  }

  return bookStatus;
}

// Function to delete or edit
function deleteEdit(e) {
  const selectedItem = e.target;
  const bookRow = selectedItem.parentElement.parentElement;

  if (selectedItem.classList.contains("trash-btn")) {
    bookRow.classList.add("fall");
    bookRow.addEventListener("transitionend", function () {
      bookRow.remove();
    });
    const bookToDelte = getBook(bookRow);
    deleteBookLS(bookToDelte);
  } else {
    console.log("Not trash btn");
    return;
  }
}

// Get books from library
const getBooks = () =>
  localStorage.getItem(localStorageItem)
    ? JSON.parse(localStorage.getItem(localStorageItem))
    : [];

// Save book to LS
function saveBookLS(book) {
  let myBooksLibrary;
  if (localStorage.getItem(localStorageItem)) {
    myBooksLibrary = JSON.parse(localStorage.getItem(localStorageItem));
  } else {
    myBooksLibrary = [];
  }

  myBooksLibrary.push(book);
  localStorage.setItem("myBooksLibrary", JSON.stringify(myBooksLibrary));
}

// Load books from LS
// Load Todos
document.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded");
  const books = getBooks();
  books.forEach((book) => {
    // Render books
    render(book);
  });
});

// Render books
const render = (book) => {
  // Create and append a task to the taskList
  const html = `
    <tr class="book" id="${book.id}">
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.pages}</td>
      <td>${book.status ? "Read" : "Not Read"}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> </td>
    </tr>
  `;

  UITableBody.innerHTML += html;
};

// Get Book
const getBook = selectedBook => {
  let id = selectedBook.getAttribute("id");
  id = parseInt(id);
  const books = getBooks();
  const book = books.find(b => b.id == id);
  return book;
}

// Delete Book LS
const deleteBookLS = book => {
  let books = getBooks();
  books = books.filter( b => b.id != book.id);
  localStorage.setItem(localStorageItem, JSON.stringify(books));

}
