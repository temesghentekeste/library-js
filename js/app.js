let localStorageItem = "myBooksLibrary";
let bookStatus = false;
let isBookToUpdate = false;
let currentBook;
let tableRowsSelector =  '#books tbody';


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

  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);

  if( isBookToUpdate === true) {
    updateUI(currentBook);
    return;
  }

  const bookRow = document.createElement("tr");
  bookRow.classList.add("book");

  // New book item

  // Add ID to bookRow: newBook
  const books = getBooks();
  console.log(books, "call getbooks");
  console.log(books);
  let id;
  if (books.length > 0) {
    id = books[books.length - 1].id
    id = id + 1;
  } else {
    id = 1;
  }
  newBook.id = id;
  bookRow.setAttribute("id", `item-${id}`);
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

  const editBook = document.createElement("button");
  editBook.innerHTML = '<i class="fas fa-edit"></i>';
  editBook.classList.add("edit-btn");
  newBookActions.appendChild(editBook);
  bookRow.appendChild(newBookActions);

  // Save book to LS
  saveBookLS(newBook);
  // Append the row back to tbody
  UITableBody.appendChild(bookRow);
  console.log(bookRow, "saveBookLS");
}

UIBtnToggleForm.addEventListener("click", (e) => {
  UIFormContainer.classList.toggle("hidden");
  return;
});

function getStatus(event) {
  if (event.target.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  return bookStatus;
}

// Function to delete or edit
function deleteEdit(e) {
  const selectedItem = e.target;
  const bookRow = selectedItem.parentElement.parentElement;
  currentBook = getBook(bookRow);

  if (selectedItem.classList.contains("trash-btn")) {
    bookRow.classList.add("fall");
    bookRow.addEventListener("transitionend", function () {
      bookRow.remove();
      resetForm();
    });
    deleteBookLS(currentBook);
  } else if (selectedItem.classList.contains("edit-btn")) {
    displayCurrentBook(currentBook);
  } else {
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
  // let id = parseId(book.id);
  // book.id = id;
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
    <tr class="book" id="item-${book.id}">
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.pages}</td>
      <td>${book.status ? "Read" : "Not Read"}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;

  UITableBody.innerHTML += html;
};

// Get Book
const getBook = (selectedBook) => {
  let id = selectedBook.getAttribute("id");
  if (id === null) {
    return;
  }
  id = parseId(id);
  const books = getBooks();
  const book = books.find((b) => b.id == id);
  return book;
};

// Delete Book LS
const deleteBookLS = (book) => {
  let books = getBooks();
  books = books.filter((b) => b.id != book.id);
  localStorage.setItem(localStorageItem, JSON.stringify(books));
};

// Display Current Book
const displayCurrentBook = (book) => {
  console.log("Book", book);
  isBookToUpdate = true;
  UIBtnAddBook.textContent = "Update Book"
  if (UIFormContainer.classList.contains("hidden")) {
    UIFormContainer.classList.remove("hidden");
  }
  UITextAuthour.value = book.author;
  UITextTitle.value = book.title;
  UINumPages.value = book.pages;
  UIChKStatus.checked = book.status;
};

// Update Current Book
const updateBook = currentBook => {
}

// Update UI
const updateUI = currentBook => {
  let id = currentBook.id;
  let book= document.querySelector(`${tableRowsSelector} #item-${id}`);
  const html = getHTML(currentBook);
  console.log(html);
  book.innerHTML = html;
  resetForm();
}

const resetForm = () => {
  UITextAuthour.value = "";
  UITextTitle.value = "book.title";
  UINumPages.value = 0;
  UIChKStatus.checked = false;

  isBookToUpdate = false;
  UIBtnAddBook.textContent = "Add New Book";
}

const parseId = id  => {
  const arrId = id.split("-");
  return parseInt(arrId[1]);
}

// Get HTML
const getHTML = () => {
  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);
  const html = `
    <tr class="book" id="item-${currentBook.id}">
      <td>${UITextAuthour.value.trim()}</td>
      <td>${UITextTitle.value.trim()}</td>
      <td>${UINumPages.value}</td>
      <td>${bookStatus ? "Read" : "Not Read"}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;
  return html;
}
