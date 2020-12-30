const UITextTitle = document.querySelector('.txt-title');
const UINumPages = document.querySelector('.num-pages');
const UIChKStatus = document.querySelector('.chk-status');
const UITableBody = document.querySelector('.table-body');
const UIBtnAddBook = document.querySelector('.btn-add-book');
const UIBtnToggleForm = document.querySelector('.btn-show-form');
const UIFormContainer = document.querySelector('.form-popup');
const UITableBooks = document.querySelector('#books');
const UIBooksContainer = document.querySelector('.library-container');
const UIHeader = document.querySelector('header');
const UITextAuthour = document.querySelector('.txt-author');

const localStorageItem = 'myBooksLibrary';
let bookStatus = false;
let isBookToUpdate = false;
let currentBook;
const tableRowsSelector = '#books tbody';
let booksCatalog = {};

function Book(author, title, pages, status) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.status = status;
}

const getBooks = () => (localStorage.getItem(localStorageItem)
  ? JSON.parse(localStorage.getItem(localStorageItem))
  : []);

function saveBookLS(book) {
  let myBooksLibrary;
  if (localStorage.getItem(localStorageItem)) {
    myBooksLibrary = JSON.parse(localStorage.getItem(localStorageItem));
  } else {
    myBooksLibrary = [];
  }

  myBooksLibrary.push(book);
  localStorage.setItem('myBooksLibrary', JSON.stringify(myBooksLibrary));
}
const parseId = (id) => {
  const arrId = id.split('-');
  return parseInt(arrId[1], 10);
};

function setCurrentBook(selectedBook) {
  let id = selectedBook.getAttribute('id');
  if (id === null) {
    return;
  }
  id = parseId(id);
  const books = getBooks();
  currentBook = books.find((b) => b.id === id);
}

const deleteBookLS = (book) => {
  let books = getBooks();
  books = books.filter((b) => b.id !== book.id);
  localStorage.setItem(localStorageItem, JSON.stringify(books));
};

const updateLS = () => {
  const books = getBooks();

  books.forEach((b, index) => {
    if (b.id === currentBook.id) {
      books.splice(index, 1, currentBook);
    }
  });

  localStorage.setItem(localStorageItem, JSON.stringify(books));
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
      <td>${bookStatus ? 'Read' : 'Not Read'}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;
  return html;
};
const toggleMinMaxIcon = () => {
  if (UIFormContainer.classList.contains('hidden')) {
    UIBtnToggleForm.innerHTML = '<i class="fas fa-plus-square min-max-icon"></i>';
  } else {
    UIBtnToggleForm.innerHTML = '<i class="fas fa-minus-square min-max-icon"></i>';
  }
};
const toggleEmptyMessage = (isEmpty) => {
  const UIEmptyMsg = document.querySelector('.empty-text');
  if (isEmpty) {
    if (UIEmptyMsg !== null) UIEmptyMsg.parentElement.remove();

    const div = document.createElement('div');
    div.innerHTML = '<h1 class="m-1 empty-text">Empty Book Store. Click the button to add books!</h1>';
    UIBooksContainer.insertAdjacentElement('beforeend', div);
  } else if (UIEmptyMsg !== null) UIEmptyMsg.parentElement.remove();
};


const renderBooksCatalog = (books) => {
  const total = books.length;
  let totalRead = 0;
  let totoalNotRead = 0;

  books.forEach((b) => {
    if (b.status === true) totalRead += 1;
    else totoalNotRead += 1;
  });

  booksCatalog = {};
  booksCatalog.total = total;
  booksCatalog.read = totalRead;
  booksCatalog.notRead = totoalNotRead;

  const div = document.createElement('div');
  div.classList.add('book-catalog');
  const html = `
      <p class="book-catalog-title">Books Catalog</p>
      <div class="info">
      <p class="total">Total: <span>${booksCatalog.total}</span></p>
      <p class="completed">Completed: <span>${booksCatalog.read}</span></p>
      <p class="to-read">To be read: <span>${booksCatalog.notRead}</span></p>
      </div>
      `;
  div.innerHTML = html;
  UIHeader.insertAdjacentElement('beforeend', div);
};
const hideBooksTable = (style) => {
  UITableBooks.classList.add(style);
  toggleEmptyMessage(true);
};

const render = (book) => {
  const html = `
    <tr class="book" id="item-${book.id}">
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.pages}</td>
      <td>${book.status ? 'Read' : 'Not Read'}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;

  UITableBody.innerHTML += html;
};

document.addEventListener('DOMContentLoaded', () => {
  const books = getBooks();
  renderBooksCatalog(books);
  if (books.length === 0) {
    hideBooksTable('hidden');
  } else {
    books.forEach((book) => {
      render(book);
    });
  }
});


const resetForm = () => {
  UITextAuthour.value = '';
  UITextTitle.value = '';
  UINumPages.value = 0;
  UIChKStatus.checked = false;
  isBookToUpdate = false;
  UIBtnAddBook.textContent = 'Add New Book';
  bookStatus = false;
};
const updateUI = (currentBook) => {
  const { id } = currentBook;
  const book = document.querySelector(`${tableRowsSelector} #item-${id}`);
  const html = getHTML();
  book.innerHTML = html;
  resetForm();
};


function addBookToLibrary(e) {
  e.preventDefault();
  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);

  if (author === '' || title === '' || pages === '' || status === '') return;
  if (isBookToUpdate === true) {
    updateUI(currentBook);
    bookStatus = currentBook.status;
    updateLS();
    renderBooksCatalog(getBooks());
    resetForm();
    return;
  }

  const bookRow = document.createElement('tr');
  bookRow.classList.add('book');

  const books = getBooks();
  let id;
  if (books.length > 0) {
    id = books[books.length - 1].id;
    id += 1;
  } else {
    id = 1;
  }
  newBook.id = id;
  bookRow.setAttribute('id', `item-${id}`);

  const newBookAuthor = document.createElement('td');
  newBookAuthor.innerText = newBook.author;
  bookRow.appendChild(newBookAuthor);

  const newBookTitle = document.createElement('td');
  newBookTitle.innerText = newBook.title;
  bookRow.appendChild(newBookTitle);

  const newBookPages = document.createElement('td');
  newBookPages.innerText = newBook.pages;
  bookRow.appendChild(newBookPages);

  const newBookStatus = document.createElement('td');
  newBookStatus.innerHTML = `${newBook.status ? 'Read' : 'Not Read'}`;
  bookRow.appendChild(newBookStatus);

  const newBookActions = document.createElement('td');
  const deleteBook = document.createElement('button');
  deleteBook.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBook.classList.add('trash-btn');
  newBookActions.appendChild(deleteBook);

  const editBook = document.createElement('button');
  editBook.innerHTML = '<i class="fas fa-edit"></i>';
  editBook.classList.add('edit-btn');
  newBookActions.appendChild(editBook);
  bookRow.appendChild(newBookActions);

  saveBookLS(newBook);
  UITableBody.appendChild(bookRow);
  UITableBooks.classList.remove('hidden');
  toggleEmptyMessage(false);
  renderBooksCatalog(getBooks());
  resetForm();
}

function getStatus(event) {
  if (event.target.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  return bookStatus;
}
const displayCurrentBook = (book) => {
  isBookToUpdate = true;
  UIBtnAddBook.textContent = 'Update Book';
  if (UIFormContainer.classList.contains('hidden')) {
    UIFormContainer.classList.remove('hidden');
  }
  UITextAuthour.value = book.author;
  UITextTitle.value = book.title;
  UINumPages.value = book.pages;
  UIChKStatus.checked = book.status;
};

function deleteEdit(e) {
  const selectedItem = e.target;
  const bookRow = selectedItem.parentElement.parentElement;
  setCurrentBook(bookRow);

  if (selectedItem.classList.contains('trash-btn')) {
    bookRow.classList.add('fall');
    bookRow.addEventListener('transitionend', () => {
      bookRow.remove();
      const books = getBooks();
      if (books.length === 0) {
        hideBooksTable('hidden');
      }
      resetForm();
    });
    deleteBookLS(currentBook);
    renderBooksCatalog(getBooks());
  } else if (selectedItem.classList.contains('edit-btn')) {
    displayCurrentBook(currentBook);
    toggleMinMaxIcon();
    bookStatus = currentBook.status;
  }
}


UIBtnToggleForm.addEventListener('click', () => {
  UIFormContainer.classList.toggle('hidden');
  toggleMinMaxIcon();
});


UIBtnAddBook.addEventListener('click', addBookToLibrary);
UIChKStatus.addEventListener('change', getStatus);
UITableBody.addEventListener('click', deleteEdit);
