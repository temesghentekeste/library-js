let myLibrary = [];
const UITextAuthour = document.querySelector('.txt-author');
const UITextTitle = document.querySelector('.txt-title');
const UINumPages = document.querySelector('.num-pages');
const UIChKStatus = document.querySelector('.chk-status');
const UITableBody = document.querySelector(".table-body");
const btnAddBook = document.querySelector(".btn-add-book");

btnAddBook.addEventListener('click', addBookToLibrary);

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
  const status = UIChKStatus.value;

  const newBook = new Book(author, title, pages, status);
  
  const bookRow = document.createElement("tr");

  // New book item
  const newBookAuthor = document.createElement("td");
  newBookAuthor.innerText = newBook.author;
  bookRow.appendChild(newBookAuthor);

  const newBookTitle = document.createElement("td");
  newBookTitle.innerText = newBook.title;
  bookRow.appendChild(newBookTitle);

  const newBookPages = document.createElement("td");
  newBookPages.innerText = newBook.pages;
  bookRow.appendChild(newBookPages);


  const newBookStatus = document.createElement("td");
  newBookStatus.innerText = newBook.status;
  bookRow.appendChild(newBookStatus);

  // Append the row back to tbody
  UITableBody.appendChild(bookRow);

}




