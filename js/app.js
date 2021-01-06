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
    books: [
      {
        id: 0,
        author: 'Temesghen',
        title: 'Coding is fun',
        pages: 200,
        status: true,
      },
      {
        id: 1,
        author: 'Biniam',
        title: 'Java is fun',
        pages: 200,
        status: true,
      },
      {
        id: 2,
        author: 'Samson',
        title: 'Faith',
        pages: 200,
        status: true,
      },
    ],
    currentBook: null,
    totalBooks: 0,
    totalUnRead: 0,
    totalRead: 0,
  };

  return {
    getBooks() {
      return data.books;
    },
  };
})();

// UI Controller
const UICtrl = (() => {
  const UISelectors = {
    tableBody: '.table-body',
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

  return {
    populateBooks,
  };
})();

// App Controller

const App = ((BookCtrl, UICtrl) => {
  const init = () => {
    const books = BookCtrl.getBooks();
    UICtrl.populateBooks(books);
  };
  return {
    init,
  };
})(BookCtrl, UICtrl);

App.init();
