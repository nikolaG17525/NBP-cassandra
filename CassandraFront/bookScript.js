import { Book } from "./Book.js";
import { Comment } from "./Comment.js";
const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get("data");
const myBooksListDiv = document.querySelector(".book-hero-book");
const myBooksCommentsDiv = document.querySelector(".book-hero-comments");

fetch(`https://localhost:7116/api/Books/api/book?bookID=${data}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((book) => {
    const myBook = new Book(
      book.bookID,
      book.author,
      book.about,
      book.title,
      book.url,
      -1
    );
    myBook.render(myBooksListDiv);
    document.querySelector(".naslov-knjige").innerText += " " + book.title;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

fetch(`https://localhost:7116/api/Books/api/comments?bookID=${data}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((commentsList) => {
    commentsList.forEach((comment) => {
      const myComment = new Comment(
        comment.bookID,
        comment.userID,
        comment.commentContent
      );
      myComment.render(myBooksCommentsDiv);
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
