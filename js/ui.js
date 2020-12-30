const UITextAuthour = document.querySelector(".txt-author");
const UITextTitle = document.querySelector(".txt-title");
const UINumPages = document.querySelector(".num-pages");
const UIChKStatus = document.querySelector(".chk-status");
const UITableBody = document.querySelector(".table-body");
const UIBtnAddBook = document.querySelector(".btn-add-book");
const UIBtnToggleForm = document.querySelector(".btn-show-form");
const UIFormContainer = document.querySelector(".form-popup");

UIBtnAddBook.addEventListener("click", addBookToLibrary);
UIChKStatus.addEventListener("change", getStatus);
UITableBody.addEventListener("click", deleteEdit);

document.addEventListener("DOMContentLoaded", () => {
  const books = getBooks();
  books.forEach((book) => {
    render(book);
  });
});

function addBookToLibrary(e) {
  e.preventDefault();

  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);

  if (isBookToUpdate === true) {
    updateUI(currentBook);
    updateLS();
    return;
  }

  const bookRow = document.createElement("tr");
  bookRow.classList.add("book");

  const books = getBooks();
  let id;
  if (books.length > 0) {
    id = books[books.length - 1].id;
    id = id + 1;
  } else {
    id = 1;
  }
  newBook.id = id;
  bookRow.setAttribute("id", `item-${id}`);

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
  newBookStatus.innerHTML = `${newBook.status ? "Read" : "Not Read"}`;
  bookRow.appendChild(newBookStatus);

  const newBookActions = document.createElement("td");
  const deleteBook = document.createElement("button");
  deleteBook.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBook.classList.add("trash-btn");
  newBookActions.appendChild(deleteBook);

  const editBook = document.createElement("button");
  editBook.innerHTML = '<i class="fas fa-edit"></i>';
  editBook.classList.add("edit-btn");
  newBookActions.appendChild(editBook);
  bookRow.appendChild(newBookActions);

  saveBookLS(newBook);
  UITableBody.appendChild(bookRow);
}

function getStatus(event) {
  if (event.target.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  return bookStatus;
}

function deleteEdit(e) {
  const selectedItem = e.target;
  const bookRow = selectedItem.parentElement.parentElement;
  currentBook = getBook(bookRow);

  if (selectedItem.classList.contains("trash-btn")) {
    bookRow.classList.add("fall");
    bookRow.addEventListener("transitionend", function () {
      bookRow.remove();
      resetForm();
    });
    deleteBookLS(currentBook);
  } else if (selectedItem.classList.contains("edit-btn")) {
    displayCurrentBook(currentBook);
  } else {
    return;
  }
}

const render = (book) => {
  const html = `
    <tr class="book" id="item-${book.id}">
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.pages}</td>
      <td>${book.status ? "Read" : "Not Read"}</td>
      <td><button class="trash-btn"><i class="fas fa-trash"></i></button> 
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `;

  UITableBody.innerHTML += html;
};

const updateUI = (currentBook) => {
  let id = currentBook.id;
  let book = document.querySelector(`${tableRowsSelector} #item-${id}`);
  const html = getHTML();
  book.innerHTML = html;
  resetForm();
};

const displayCurrentBook = (book) => {
  isBookToUpdate = true;
  UIBtnAddBook.textContent = "Update Book";
  if (UIFormContainer.classList.contains("hidden")) {
    UIFormContainer.classList.remove("hidden");
  }
  UITextAuthour.value = book.author;
  UITextTitle.value = book.title;
  UINumPages.value = book.pages;
  UIChKStatus.checked = book.status;
};

const resetForm = () => {
  UITextAuthour.value = "";
  UITextTitle.value = "";
  UINumPages.value = 0;
  UIChKStatus.checked = false;

  isBookToUpdate = false;
  UIBtnAddBook.textContent = "Add New Book";
};

UIBtnToggleForm.addEventListener("click", (e) => {
  UIFormContainer.classList.toggle("hidden");
  return;
});
