let myLibrary = [];
let bookStatus = false;
const UITextAuthour = document.querySelector('.txt-author');
const UITextTitle = document.querySelector('.txt-title');
const UINumPages = document.querySelector('.num-pages');
const UIChKStatus = document.querySelector('.chk-status');
const UITableBody = document.querySelector(".table-body");
const btnAddBook = document.querySelector(".btn-add-book");
const btnshowForm = document.querySelector(".btn-show-form");
const UIFormContainer = document.querySelector(".form-popup");

btnAddBook.addEventListener('click', addBookToLibrary);
UIChKStatus.addEventListener("change", getStatus);


function Book(author, title, pages, status) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.status = status;
}

function addBookToLibrary(e) {
  e.preventDefault();
  console.log(UIChKStatus, UIChKStatus.value);

  const author = UITextAuthour.value.trim();
  const title = UITextTitle.value.trim();
  const pages = UINumPages.value;
  const status = bookStatus;
  const newBook = new Book(author, title, pages, status);

  const bookRow = document.createElement("tr");

  // New book item

  // Author column
  const newBookAuthor = document.createElement("td");
  newBookAuthor.innerText = newBook.author;
  bookRow.appendChild(newBookAuthor);

  // Title column
  const newBookTitle = document.createElement("td");
  newBookTitle.innerText = newBook.title;
  bookRow.appendChild(newBookTitle);

  // Pages column
  const newBookPages = document.createElement("td");
  newBookPages.innerText = newBook.pages;
  bookRow.appendChild(newBookPages);
  
  // Status column
  const newBookStatus = document.createElement("td");
  newBookStatus.innerHTML = `${newBook.status ? "Read" : "Not Read"}`;
  bookRow.appendChild(newBookStatus);
  
  // Delete Button
  const deleteBook = document.createElement("button");
  deleteBook.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBook.classList.add("trash-btn");
  bookRow.appendChild(deleteBook);

  // Append the row back to tbody
  UITableBody.appendChild(bookRow);
}


btnshowForm.addEventListener('click', e => {
  UIFormContainer.classList.toggle('hidden');
})

 function getStatus(event) {
   if (event.target.checked) {
     bookStatus = true;
     console.log(event.target.value, bookStatus);
    }else {
      bookStatus =false;
      console.log(event.target.value, bookStatus);
   }

   return bookStatus;
 }




