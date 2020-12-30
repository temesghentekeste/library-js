let localStorageItem = "myBooksLibrary";
let bookStatus = false;
let isBookToUpdate = false;
let currentBook;
let tableRowsSelector = "#books tbody";
let booksCatalog = {};

function Book(author, title, pages, status) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.status = status;
}

const getBooks = () =>
  localStorage.getItem(localStorageItem)
    ? JSON.parse(localStorage.getItem(localStorageItem))
    : [];

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

const getBook = (selectedBook) => {
  let id = selectedBook.getAttribute("id");
  if (id === null) {
    return;
  }
  id = parseId(id);
  const books = getBooks();
  const book = books.find((b) => b.id == id);
  console.log("getBook", book);
  return book;
};

const deleteBookLS = (book) => {
  let books = getBooks();
  books = books.filter((b) => b.id != book.id);
  localStorage.setItem(localStorageItem, JSON.stringify(books));
};

const updateLS = () => {
  let books = getBooks();

  books.forEach((b, index) => {
    if (b.id === currentBook.id) {
      books.splice(index, 1, currentBook);
      return;
    }
  });

  localStorage.setItem(localStorageItem, JSON.stringify(books));
};

const parseId = (id) => {
  const arrId = id.split("-");
  return parseInt(arrId[1]);
};

const getHTML = () => {
  currentBook.author = UITextAuthour.value.trim();
  currentBook.title = UITextTitle.value.trim();
  currentBook.pages = UINumPages.value;
  currentBook.status = bookStatus;
  const html = `
    <tr class="book" id="item-${currentBook.id}">
      <td>${currentBook.author}</td>
      <td>${currentBook.title}</td>
      <td>${currentBook.pages}</td>
      <td>${bookStatus ? "Read" : "Not Read"}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;
  return html;
};
