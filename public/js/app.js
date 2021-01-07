class Book {
  constructor() {
    this.book = {
      id: 0,
      author: 'Anonymous',
      title: 'Anonymous',
      pages: 0,
      status: false,
    };

    this.localStorageKey = 'myBooksStorageKey';
    this.data = {
      books: this.getItemsFromStorage(),
      currentBook: null,
      totalBooks: 0,
      totalUnRead: 0,
      totalRead: 0,
      mode: 'insert',
    };

    this.uiSelectors = {
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
      clearAll: '.clear-all',
    };
  }

  populateBooks(books) {
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
    document.querySelector(this.uiSelectors.tableBody).innerHTML = html;
  }

  toggleForm() {
    document
      .querySelector(this.uiSelectors.frmContainer)
      .classList.toggle('hidden');
  }

  displayFormContainer() {
    document
      .querySelector(this.uiSelectors.frmContainer)
      .classList.remove('hidden');
  }

  toggleMinMaxIcon(isHidden) {
    const toggler = document.querySelector(this.uiSelectors.toggleFromBtn);
    if (isHidden) {
      toggler.innerHTML = '<i class="fas fa-plus-square min-max-icon"></i>';
    } else {
      toggler.innerHTML = '<i class="fas fa-minus-square min-max-icon"></i>';
    }
  }

  addBookRow(newBook) {
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
      .querySelector(this.uiSelectors.tableBody)
      .insertAdjacentElement('beforeend', bookRow);
  }

  updateBookRow(book) {
    const { id } = book;
    const tableRow = this.uiSelectors.tableBody;
    const row = document.querySelector(`${tableRow} #item-${id}`);
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
  }

  deleteBookRow = (bookRow) => {
    bookRow.remove();
  };

  clearInput() {
    document.querySelector(this.uiSelectors.txtBookAuthor).value = '';
    document.querySelector(this.uiSelectors.txtBookTitle).value = '';
    document.querySelector(this.uiSelectors.numBookPages).value = '';
    document.querySelector(this.uiSelectors.chkBookStatus).checked = false;
    document.querySelector(this.uiSelectors.addUpdateBtn).innerText = 'Add New Book';
  }

  hideTable() {
    document.querySelector(this.uiSelectors.table).classList.add('hidden');
  }

  displayTable() {
    document.querySelector(this.uiSelectors.table).classList.remove('hidden');
  }

  displayEmptyBookStoreMessage() {
    const div = document.createElement('div');
    div.innerHTML = '<h1 class="m-1 empty-text">Empty Book Store. Click the button to add books!</h1>';
    document
      .querySelector(this.uiSelectors.tableContainer)
      .insertAdjacentElement('beforeend', div);
  }

  hideEmptyBookStoreMessage() {
    const UIEmptyDSText = document.querySelector(
      this.uiSelectors.emptyDataStore,
    );
    UIEmptyDSText.parentElement.remove();
  }

  getBookInput = () => ({
    author: document.querySelector(this.uiSelectors.txtBookAuthor).value,
    title: document.querySelector(this.uiSelectors.txtBookTitle).value,
    pages: document.querySelector(this.uiSelectors.numBookPages).value,
    status: document.querySelector(this.uiSelectors.chkBookStatus).checked,
  });

  displayBookCatalog = (booksCatalog) => {
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
      .querySelector(this.uiSelectors.mainHeader)
      .insertAdjacentElement('beforeend', div);
  };

  toggleAddUpdateBtn = () => {
    document.querySelector(this.uiSelectors.addUpdateBtn).textContent = 'Update Book';
  };

  addCurrentBookToForm = () => {
    const book = this.getCurrentBook();
    document.querySelector(this.uiSelectors.txtBookAuthor).value = book.author;
    document.querySelector(this.uiSelectors.txtBookTitle).value = book.title;
    document.querySelector(this.uiSelectors.numBookPages).value = book.pages;
    document.querySelector(this.uiSelectors.chkBookStatus).checked = book.status;
  };

  resetUI = () => {
    const bookCatalog = this.getBookCatalog();
    this.displayBookCatalog(bookCatalog);
    this.clearInput();
  };

  removeItems = () => {
    let bookItems = document.querySelectorAll(this.uiSelectors.table);
    bookItems = Array.from(bookItems);
    bookItems.forEach((listItem) => listItem.remove());
  };

  loadEventListeners() {
    const addBookSubmit = (e) => {
      e.preventDefault();

      const bookInput = this.getBookInput();

      if (
        bookInput.author === ''
        || bookInput.title === ''
        || bookInput.pages === ''
      ) {
        return;
      }

      const currentBookMode = this.getCurrentBookMode();

      if (currentBookMode === 'update') {
        const updatedBook = this.updateBook(bookInput);
        this.updateItemStorage(updatedBook);
        this.updateBookRow(updatedBook);

        this.setCurrentBookMode('insert');
        this.resetUI();
        return;
      }

      const newBook = this.addBook(bookInput);
      this.storeItem(newBook);
      this.addBookRow(newBook);
      const isEmptyDS = document.querySelector(this.uiSelectors.emptyDataStore);

      if (isEmptyDS) {
        this.hideEmptyBookStoreMessage();
        this.displayTable();
      }
      this.resetUI();
    };

    const toggleForm = (e) => {
      e.preventDefault();
      this.toggleForm();
      const isHidden = document
        .querySelector(this.uiSelectors.frmContainer)
        .classList.contains('hidden');
      this.toggleMinMaxIcon(isHidden);
    };

    const deleteEditBook = (e) => {
      const selectedBook = e.target;
      const bookRow = selectedBook.parentElement.parentElement;
      let id = bookRow.getAttribute('id');

      if (id === null) {
        return;
      }

      id = this.parseId(id);
      const currentBook = this.getBookById(id);

      this.setCurrentBook(currentBook);
      if (selectedBook.classList.contains('trash-btn')) {
        this.deleteBook(currentBook);
        this.deleteItemFromStorage(currentBook.id);
        this.deleteBookRow(bookRow);
        const books = this.getBooks();
        if (books.length === 0) {
          this.hideTable();
          this.displayEmptyBookStoreMessage();
        }

        this.resetUI();
        return;
      }

      if (!selectedBook.classList.contains('edit-btn')) {
        return;
      }

      const formContainer = document.querySelector(
        this.uiSelectors.frmContainer,
      );

      if (formContainer.classList.contains('hidden')) {
        this.displayFormContainer();
      }

      this.toggleAddUpdateBtn();
      this.addCurrentBookToForm();
      this.setCurrentBookMode('update');
    };

    document
      .querySelector(this.uiSelectors.clearAll)
      .addEventListener('click', (e) => {
        e.preventDefault();
        this.clearAllItems();

        this.resetUI();

        this.populateBooks([]);
        this.hideTable();
        const emptyDataStore = document.querySelector(
          this.uiSelectors.emptyDataStore,
        );

        if (!emptyDataStore) {
          this.displayEmptyBookStoreMessage();
        }

        this.removeItemsFromStorage();
      });

    document
      .querySelector(this.uiSelectors.addUpdateBtn)
      .addEventListener('click', addBookSubmit);

    document
      .querySelector(this.uiSelectors.toggleFromBtn)
      .addEventListener('click', toggleForm);

    document
      .querySelector(this.uiSelectors.tableBody)
      .addEventListener('click', deleteEditBook);
  }

  init() {
    this.loadEventListeners();

    const books = this.getBooks();
    if (books.length > 0) {
      this.populateBooks(books);

      this.displayTable();
    } else {
      this.hideTable();
      this.displayEmptyBookStoreMessage();
    }
    this.resetUI();
  }

  storeItem(item) {
    let bookItems;

    if (localStorage.getItem(this.localStorageKey) === null) {
      bookItems = [];
      bookItems.push(item);
    } else {
      bookItems = JSON.parse(localStorage.getItem(this.localStorageKey));
      bookItems.push(item);
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(bookItems));
  }

  getItemsFromStorage() {
    let bookItems;
    if (localStorage.getItem(this.localStorageKey) === null) {
      bookItems = [];
    } else {
      bookItems = JSON.parse(localStorage.getItem(this.localStorageKey));
    }
    return bookItems;
  }

  updateItemStorage(updatedItem) {
    const bookItems = JSON.parse(localStorage.getItem(this.localStorageKey));
    bookItems.forEach((book, index) => {
      if (book.id === updatedItem.id) {
        bookItems.splice(index, 1, updatedItem);
      }
    });

    localStorage.setItem(this.localStorageKey, JSON.stringify(bookItems));
  }

  deleteItemFromStorage(id) {
    const bookItems = JSON.parse(localStorage.getItem(this.localStorageKey));
    bookItems.forEach((item, index) => {
      if (item.id === id) {
        bookItems.splice(index, 1);
      }
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(bookItems));
  }

  removeItemsFromStorage() {
    localStorage.removeItem(this.localStorageKey);
  }

  getBooks() {
    return this.data.books;
  }

  getBookCatalog() {
    const { books } = this.data;
    const total = this.data.books.length;
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

    this.data.booksCatalog = booksCatalog;

    return this.data.booksCatalog;
  }

  addBook({
    author, title, pages, status,
  }) {
    let id;
    if (this.data.books.length > 0) {
      id = this.data.books[this.data.books.length - 1].id;
      id += 1;
    } else {
      id = 1;
    }

    pages = parseInt(pages, 10);

    this.book = {
      id,
      author,
      title,
      pages,
      status,
    };
    this.data.books.push(this.book);
    return this.book;
  }

  updateBook({
    author, title, pages, status,
  }) {
    pages = parseInt(pages, 10);

    const bookToUpdate = this.data.currentBook;
    bookToUpdate.author = author;
    bookToUpdate.title = title;
    bookToUpdate.pages = pages;
    bookToUpdate.status = status;

    this.data.books.forEach((book, index) => {
      if (book.id === bookToUpdate.id) {
        this.data.books.splice(index, 1, bookToUpdate);
      }
    });
    return bookToUpdate;
  }

  getBookById(id) {
    const found = this.data.books.find((item) => item.id === id);
    return found;
  }

  setCurrentBook(book) {
    this.data.currentBook = book;
  }

  getCurrentBook() {
    return this.data.currentBook;
  }

  setCurrentBookMode(mode = 'update') {
    this.data.mode = mode;
  }

  getCurrentBookMode() {
    return this.data.mode;
  }

  deleteBook(book) {
    this.data.books = this.data.books.filter((b) => b.id !== book.id);
  }

  clearAllItems() {
    this.data.books = [];
    this.data.currentBook = null;
    this.data.totalBooks = 0;
    this.data.totalUnRead = 0;
    this.data.totalRead = 0;
    this.data.mode = 'insert';
  }

  parseId = (id) => {
    const arrId = id.split('-');
    return parseInt(arrId[1], 10);
  };
}

const bookApp = new Book();
bookApp.init();
