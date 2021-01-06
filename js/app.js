// Storage Controller

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
    books: [],
    currentBook: null,
    totalBooks: 0,
    totalUnRead: 0,
    totalRead: 0,
  };

  return {
    getBooks() {
      return data.books;
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
  };
})();

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    tableBody: '.table-body',
    addBtn: '.btn-add-book',
    toggleFromBtn: '.btn-show-form',
    frmContainer: '.form-popup',
    txtBookAuthor: '.txt-author',
    txtBookTitle: '.txt-title',
    numBookPages: '.num-pages',
    chkBookStatus: '.chk-status',
    table: '#books',
    tableContainer: '.library-container',
    emptyDataStore: '.empty-text',
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

  const clearInput = () => {
    document.querySelector(UISelectors.txtBookAuthor).value = '';
    document.querySelector(UISelectors.txtBookTitle).value = '';
    document.querySelector(UISelectors.numBookPages).value = '';
    document.querySelector(UISelectors.chkBookStatus).value = '';
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

      const newBook = BookCtrl.addBook(bookInput);
      UICtrl.addBookRow(newBook);
      const isEmptyDS = document.querySelector(UISelectors.emptyDataStore);

      if( isEmptyDS ) {
        UICtrl.hideEmptyBookStoreMessage();
        UICtrl.displayTable();
      }

      UICtrl.clearInput();
    };

    const toggleForm = (e) => {
      e.preventDefault();
      UICtrl.toggleForm();
      const isHidden = document
        .querySelector(UISelectors.frmContainer)
        .classList.contains('hidden');
      UICtrl.toggleMinMaxIcon(isHidden);
    };

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', addBookSubmit);

    document
      .querySelector(UISelectors.toggleFromBtn)
      .addEventListener('click', toggleForm);
  };

  const init = () => {
    const books = BookCtrl.getBooks();
    loadEventListeners();

    if (books.length > 0) {
      UICtrl.populateBooks();
      UICtrl.displayTable();
    } else {
      UICtrl.hideTable();
      UICtrl.displayEmptyBookStoreMessage();
    }
  };

  return {
    init,
  };
})(BookCtrl, UICtrl);

App.init();
