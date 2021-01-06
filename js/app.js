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
    logData() {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (() => {
  console.log('UI Controller...');
})();

// App Controller

const App = ((BookCtrl, UICtrl) => {
  const init = () => {
    console.log('Initializing app ...');
    BookCtrl.logData();
  };
  return {
    init,
  };
})(BookCtrl, UICtrl);

App.init();
