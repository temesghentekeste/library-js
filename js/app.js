// Storage Controller
const StorageCtrl = (function () {
  const localStorageKey = 'bookItems';
  return {
    storeItem(item) {
      console.log('called');
      let bookItems;

      if (localStorage.getItem(localStorageKey) === null) {
        bookItems = [];
        bookItems.push(item);
      } else {
        bookItems = JSON.parse(localStorage.getItem(localStorageKey));
        bookItems.push(item);
      }
      localStorage.setItem(localStorageKey, JSON.stringify(bookItems));
    },

    getItemsFromStorage() {
      let bookItems;
      if (localStorage.getItem(localStorageKey) === null) {
        bookItems = [];
      } else {
        bookItems = JSON.parse(localStorage.getItem(localStorageKey));
      }
      return bookItems;
    },

    updateItemStorage(updatedItem) {
      const bookItems = JSON.parse(localStorage.getItem(localStorageKey));
      console.log('updating');
      bookItems.forEach((meal, index) => {
        if (meal.id === updatedItem.id) {
          bookItems.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem(localStorageKey, JSON.stringify(bookItems));
    },

    deleteItemFromStorage(id) {
      const bookItems = JSON.parse(localStorage.getItem(localStorageKey));
      bookItems.forEach((item, index) => {
        if (item.id === id) {
          bookItems.splice(index, 1);
        }
      });
      localStorage.setItem(localStorageKey, JSON.stringify(bookItems));
    },
  };
})();

// Item Controller
const BookCtrl = (() => {
  function Book(id, author, title, pages, status) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.status = status;
  }

  // DS / State
  const data = {
    books: StorageCtrl.getItemsFromStorage(),
    currentBook: null,
    totalBooks: 0,
    totalUnRead: 0,
    totalRead: 0,
    mode: 'insert',
  };

  return {
    getBooks() {
      return data.books;
    },

    getBookCatalog() {
      const { books } = data;
      const total = data.books.length;
      let totalRead = 0;
      let totalNotRead = 0;

      books.forEach((b) => {
        if (b.status === true) totalRead += 1;
        else totalNotRead += 1;
      });

      const booksCatalog = {
        total,
        read: totalRead,
        notRead: totalNotRead,
      };

      data.booksCatalog = booksCatalog;

      return data.booksCatalog;
    },

    addBook({ author, title, pages, status }) {
      let id;
      if (data.books.length > 0) {
        id = data.books[data.books.length - 1].id;
        id += 1;
      } else {
        id = 1;
      }

      pages = parseInt(pages, 10);

      const newBook = new Book(id, author, title, pages, status);
      data.books.push(newBook);
      return newBook;
    },

    updateBook({ author, title, pages, status }) {
      pages = parseInt(pages, 10);

      const bookToUpdate = data.currentBook;
      bookToUpdate.author = author;
      bookToUpdate.title = title;
      bookToUpdate.pages = pages;
      bookToUpdate.status = status;

      data.books.forEach((book, index) => {
        if (book.id === bookToUpdate.id) {
          data.books.splice(index, 1, bookToUpdate);
        }
      });
      return bookToUpdate;
    },

    getBookById(id) {
      const found = data.books.find((item) => item.id === id);
      return found;
    },

    setCurrentBook(book) {
      data.currentBook = book;
    },

    getCurrentBook() {
      return data.currentBook;
    },

    setCurrentBookMode(mode = 'update') {
      data.mode = mode;
    },

    getCurrentBookMode() {
      return data.mode;
    },

    deleteBook(book) {
      data.books = data.books.filter((b) => b.id !== book.id);
    },

    parseId(id) {
      const arrId = id.split('-');
      return parseInt(arrId[1], 10);
    },
  };
})();

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    tableBody: '.table-body',
    addUpdateBtn: '.btn-add-book',
    toggleFromBtn: '.btn-show-form',
    frmContainer: '.form-popup',
    txtBookAuthor: '.txt-author',
    txtBookTitle: '.txt-title',
    numBookPages: '.num-pages',
    chkBookStatus: '.chk-status',
    table: '#books',
    tableContainer: '.library-container',
    emptyDataStore: '.empty-text',
    mainHeader: 'header',
    mainHeader: 'header',
  };

  const populateBooks = (books) => {
    let html = '';

    books.forEach((book) => {
      html += `
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
    });

    document.querySelector(UISelectors.tableBody).innerHTML = html;
  };

  const toggleForm = () => {
    document.querySelector(UISelectors.frmContainer).classList.toggle('hidden');
  };

  const displayFormContainer = () => {
    document.querySelector(UISelectors.frmContainer).classList.remove('hidden');
  };

  const toggleMinMaxIcon = (isHidden) => {
    const toggler = document.querySelector(UISelectors.toggleFromBtn);
    if (isHidden) {
      toggler.innerHTML = '<i class="fas fa-plus-square min-max-icon"></i>';
    } else {
      toggler.innerHTML = '<i class="fas fa-minus-square min-max-icon"></i>';
    }
  };

  const addBookRow = (newBook) => {
    const bookRow = document.createElement('tr');
    bookRow.classList.add('book');

    bookRow.setAttribute('id', `item-${newBook.id}`);

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

    document
      .querySelector(UISelectors.tableBody)
      .insertAdjacentElement('beforeend', bookRow);
  };

  const updateBookRow = (book) => {
    const { id } = book;
    const tableRow = UISelectors.tableBody;
    row = document.querySelector(`${tableRow} #item-${id}`);
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
    row.innerHTML = html;
  };

  const deleteBookRow = (bookRow) => {
    bookRow.remove();
  };

  const clearInput = () => {
    document.querySelector(UISelectors.txtBookAuthor).value = '';
    document.querySelector(UISelectors.txtBookTitle).value = '';
    document.querySelector(UISelectors.numBookPages).value = '';
    document.querySelector(UISelectors.chkBookStatus).checked = false;
    document.querySelector(UISelectors.addUpdateBtn).innerText = 'Add New Book';
  };

  const hideTable = () => {
    document.querySelector(UISelectors.table).classList.add('hidden');
  };

  const displayTable = () => {
    document.querySelector(UISelectors.table).classList.remove('hidden');
  };

  const displayEmptyBookStoreMessage = () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<h1 class="m-1 empty-text">Empty Book Store. Click the button to add books!</h1>';
    document
      .querySelector(UISelectors.tableContainer)
      .insertAdjacentElement('beforeend', div);
  };

  const hideEmptyBookStoreMessage = () => {
    const UIEmptyDSText = document.querySelector(UISelectors.emptyDataStore);

    UIEmptyDSText.parentElement.remove();
  };

  const getBookInput = () => ({
    author: document.querySelector(UISelectors.txtBookAuthor).value,
    title: document.querySelector(UISelectors.txtBookTitle).value,
    pages: document.querySelector(UISelectors.numBookPages).value,
    status: document.querySelector(UISelectors.chkBookStatus).checked,
  });

  const displayBookCatalog = (booksCatalog) => {
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
    document
      .querySelector(UISelectors.mainHeader)
      .insertAdjacentElement('beforeend', div);
  };

  const toggleAddUpdateBtn = () => {
    document.querySelector(UISelectors.addUpdateBtn).textContent =
      'Update Book';
  };

  const addCurrentBookToForm = () => {
    const book = BookCtrl.getCurrentBook();
    document.querySelector(UISelectors.txtBookAuthor).value = book.author;
    document.querySelector(UISelectors.txtBookTitle).value = book.title;
    document.querySelector(UISelectors.numBookPages).value = book.pages;
    document.querySelector(UISelectors.chkBookStatus).checked = book.status;
  };

  const resetUI = () => {
    const bookCatalog = BookCtrl.getBookCatalog();
    displayBookCatalog(bookCatalog);
    clearInput();
  };

  const getSelectors = () => UISelectors;
  return {
    populateBooks,
    getSelectors,
    toggleForm,
    toggleMinMaxIcon,
    getBookInput,
    addBookRow,
    clearInput,
    hideTable,
    displayTable,
    displayEmptyBookStoreMessage,
    hideEmptyBookStoreMessage,
    displayBookCatalog,
    toggleAddUpdateBtn,
    addCurrentBookToForm,
    displayFormContainer,
    updateBookRow,
    deleteBookRow,
    resetUI,
  };
})();

// App Controller

const App = ((BookCtrl, UICtrl) => {
  const loadEventListeners = () => {
    const UISelectors = UICtrl.getSelectors();

    const addBookSubmit = (e) => {
      e.preventDefault();

      const bookInput = UICtrl.getBookInput();

      if (
        bookInput.author === '' ||
        bookInput.title === '' ||
        bookInput.pages === ''
      ) {
        return;
      }

      const currentBookMode = BookCtrl.getCurrentBookMode();

      if (currentBookMode === 'update') {
        const updatedBook = BookCtrl.updateBook(bookInput);
        StorageCtrl.updateItemStorage(bookInput);
        UICtrl.updateBookRow(updatedBook);

        BookCtrl.setCurrentBookMode('insert');
        UICtrl.resetUI();
        return;
      }

      const newBook = BookCtrl.addBook(bookInput);
      StorageCtrl.storeItem(newBook);
      UICtrl.addBookRow(newBook);
      const isEmptyDS = document.querySelector(UISelectors.emptyDataStore);

      if (isEmptyDS) {
        UICtrl.hideEmptyBookStoreMessage();
        UICtrl.displayTable();
      }
      UICtrl.resetUI();
    };

    const toggleForm = (e) => {
      e.preventDefault();
      UICtrl.toggleForm();
      const isHidden = document
        .querySelector(UISelectors.frmContainer)
        .classList.contains('hidden');
      UICtrl.toggleMinMaxIcon(isHidden);
    };

    const deleteEditBook = (e) => {
      const selectedBook = e.target;
      const bookRow = selectedBook.parentElement.parentElement;
      let id = bookRow.getAttribute('id');

      if (id === null) {
        return;
      }

      id = BookCtrl.parseId(id);
      const currentBook = BookCtrl.getBookById(id);

      // Set current item
      BookCtrl.setCurrentBook(currentBook);
      if (selectedBook.classList.contains('trash-btn')) {
        BookCtrl.deleteBook(currentBook);
        StorageCtrl.deleteItemFromStorage(currentBook.id);
        UICtrl.deleteBookRow(bookRow);
        const books = BookCtrl.getBooks();
        if (books.length === 0) {
          UICtrl.hideTable();
          UICtrl.displayEmptyBookStoreMessage();
        }

        UICtrl.resetUI();
        return;
      }

      if (!selectedBook.classList.contains('edit-btn')) {
        return;
      }

      const formContainer = document.querySelector(UISelectors.frmContainer);

      if (formContainer.classList.contains('hidden')) {
        UICtrl.displayFormContainer();
      }

      UICtrl.toggleAddUpdateBtn();
      UICtrl.addCurrentBookToForm();
      BookCtrl.setCurrentBookMode('update');
    };

    document
      .querySelector(UISelectors.addUpdateBtn)
      .addEventListener('click', addBookSubmit);

    document
      .querySelector(UISelectors.toggleFromBtn)
      .addEventListener('click', toggleForm);

    document
      .querySelector(UISelectors.tableBody)
      .addEventListener('click', deleteEditBook);
  };

  const init = () => {
    loadEventListeners();

    const books = BookCtrl.getBooks();
    if (books.length > 0) {
      UICtrl.populateBooks(books);
      
      UICtrl.displayTable();
    } else {
      UICtrl.hideTable();
      UICtrl.displayEmptyBookStoreMessage();
    }
    UICtrl.resetUI();
  };

  return {
    init,
  };
})(BookCtrl, UICtrl);

App.init();
