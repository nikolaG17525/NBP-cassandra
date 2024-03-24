import { Book } from "./Book.js";
// Izvući parametar iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get("data");

localStorage.setItem("currentUserID", data);

const booksListDiv = document.querySelector(".books-list");
const myBooksListRecommendedDiv = document.querySelector(
  ".books-list-recommended"
);
const myBooksListDiv = document.querySelector(".my-books-list");

fetch("https://localhost:7116/api/Books/api/books")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((booksList) => {
    booksList.forEach((book) => {
      const myBook = new Book(
        book.bookID,
        book.author,
        book.about,
        book.title,
        book.url,
        -1
      );
      myBook.render(booksListDiv);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch(`https://localhost:7116/api/Books/api/mybooks?userID=${data}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((booksList) => {
    booksList.forEach((book) => {
      const myBook = new Book(
        book.bookID,
        book.author,
        book.about,
        book.title,
        book.url,
        book.rating
      );
      myBook.render(myBooksListDiv);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch(`https://localhost:7116/api/Books/api/recommendedbooks?userID=${data}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((booksList) => {
    booksList.forEach((book) => {
      const myBook = new Book(
        book.bookID,
        book.author,
        book.about,
        book.title,
        book.url,
        -2
      );
      myBook.render(myBooksListRecommendedDiv);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

let dugmeOdjava = document.querySelector(".dugme-odjava");
dugmeOdjava.addEventListener("click", function () {
  window.open(`index.html`, "_self");
  localStorage.setItem("currentUserID", null);
});
