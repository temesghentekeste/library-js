class UICtrl {
  constructor() {
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

  deleteBookRow(bookRow) {
    bookRow.remove();
  }

  clearInput() {
    document.querySelector(this.uiSelectors.txtBookAuthor).value = '';
    document.querySelector(this.uiSelectors.txtBookTitle).value = '';
    document.querySelector(this.uiSelectors.numBookPages).value = '';
    document.querySelector(this.uiSelectors.chkBookStatus).checked = false;
    document.querySelector(this.uiSelectors.addUpdateBtn).innerText =
      'Add New Book';
  }

  hideTable() {
    document.querySelector(this.uiSelectors.table).classList.add('hidden');
  }

  displayTable() {
    document.querySelector(this.uiSelectors.table).classList.remove('hidden');
  }

  displayEmptyBookStoreMessage() {
    const div = document.createElement('div');
    div.innerHTML =
      '<h1 class="m-1 empty-text">Empty Book Store. Click the button to add books!</h1>';
    document
      .querySelector(this.uiSelectors.tableContainer)
      .insertAdjacentElement('beforeend', div);
  }

  hideEmptyBookStoreMessage() {
    const UIEmptyDSText = document.querySelector(
      this.uiSelectors.emptyDataStore
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
    document.querySelector(this.uiSelectors.addUpdateBtn).textContent =
      'Update Book';
  };

  addCurrentBookToForm = () => {
    const book = BookCtrl.getCurrentBook();
    document.querySelector(this.uiSelectors.txtBookAuthor).value = book.author;
    document.querySelector(this.uiSelectors.txtBookTitle).value = book.title;
    document.querySelector(this.uiSelectors.numBookPages).value = book.pages;
    document.querySelector(this.uiSelectors.chkBookStatus).checked =
      book.status;
  };

  resetUI = () => {
    const bookCatalog = BookCtrl.getBookCatalog();
    displayBookCatalog(bookCatalog);
    clearInput();
  };

  removeItems = () => {
    let bookItems = document.querySelectorAll(this.uiSelectors.table);
    bookItems = Array.from(bookItems);
    bookItems.forEach((listItem) => listItem.remove());
  };

  getSelectors = () => this.uiSelectors;
}
