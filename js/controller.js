class BookCtrl {
  constructor(id, author, title, pages, status) {
    this.book = {
      id,
      author,
      title,
      pages,
      status,
    };

    this.data = {
      books: new LocalStorage.getItemsFromStorage(),
      currentBook: null,
      totalBooks: 0,
      totalUnRead: 0,
      totalRead: 0,
      mode: 'insert',
    };
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

  addBook({ author, title, pages, status }) {
    let id;
    if (data.books.length > 0) {
      id = data.books[data.books.length - 1].id;
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

  updateBook({ author, title, pages, status }) {
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

  parseId(id) {
    const arrId = id.split('-');
    return parseInt(arrId[1], 10);
  }
}
