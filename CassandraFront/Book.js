import { Comment } from "./Comment.js";

export class Book {
  constructor(bookID, author, about, title, url, rating) {
    this.bookID = bookID;
    this.author = author;
    this.about = about;
    this.title = title;
    this.url = url;
    this.rating = rating;
  }

  render(targetDiv) {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const imgElement = document.createElement("img");
    imgElement.src = this.url;
    imgElement.setAttribute("book-url", this.url);
    imgElement.addEventListener("click", function () {
      var clickedBookID = oceniDugme.getAttribute("book-id");
      window.open(
        `book.html?data=${encodeURIComponent(clickedBookID)}`,
        "_self"
      );
    });

    const titlePara = document.createElement("h2");
    titlePara.textContent = this.title;
    titlePara.setAttribute("book-title", this.title);
    titlePara.classList.add("naslov");

    const authorPara = document.createElement("h3");
    authorPara.textContent = this.author;
    authorPara.setAttribute("book-author", this.author);
    authorPara.classList.add("autor");

    const ratingPara = document.createElement("p");
    ratingPara.textContent = this.rating;
    ratingPara.setAttribute("book-rating", this.rating);
    ratingPara.classList.add("ocena");

    const divElement = document.createElement("div");
    divElement.classList.add("dugmici");

    const oceniDugme = document.createElement("button");
    oceniDugme.textContent = "Oceni";
    oceniDugme.setAttribute("book-id", this.bookID);
    oceniDugme.addEventListener("click", function () {
      var clickedBookID = oceniDugme.getAttribute("book-id");
      var clickedBookUrl = imgElement.getAttribute("book-url");
      var clickedBookTitle = titlePara.getAttribute("book-title");
      var clickedBookAuthor = authorPara.getAttribute("book-author");
      var selectedValue = prompt("Izaberite ocenu (od 1 do 10):", "10");
      var currentUserID = localStorage.getItem("currentUserID");
      var myBooksListDiv = document.querySelector(".my-books-list");

      // Provera da li je korisnik kliknuo na Cancel ili nije uneo nista
      if (selectedValue === null || selectedValue === "") return;

      // Parsiranje unete vrednosti u int
      var ocena = parseInt(selectedValue);

      // Provera da li se uneta vrednost moze parsirati u int
      if (isNaN(ocena)) return;

      // Provera da li je uneta vrednost u opsegu od 1 do 10
      if (ocena < 1 || ocena > 10) return;

      const ratingData = {
        userID: currentUserID,
        bookRating: parseInt(selectedValue),
        about: "Ovo je prica o...",
        author: clickedBookAuthor,
        bookID: clickedBookID,
        title: clickedBookTitle,
        url: clickedBookUrl,
      };

      fetch("https://localhost:7116/api/Books/api/changerating", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      });
      const novaKnjiga = new Book(
        clickedBookID,
        clickedBookAuthor,
        "Ovo je prica 0...",
        clickedBookTitle,
        clickedBookUrl,
        parseInt(selectedValue)
      );
      if (myBooksListDiv && proveriNaslov(clickedBookTitle)) {
        novaKnjiga.render(myBooksListDiv);
      }

      if (myBooksListDiv && !proveriNaslov(clickedBookTitle)) {
        vratiOcenuP(clickedBookTitle).querySelector(".ocena").innerText =
          parseInt(selectedValue);
      }
    });

    const komentarisiDugme = document.createElement("button");
    komentarisiDugme.textContent = "Komentarisi";
    komentarisiDugme.setAttribute("book-id", this.bookID);
    komentarisiDugme.addEventListener("click", function () {
      let clickedBookID = oceniDugme.getAttribute("book-id");
      let currentUserID = localStorage.getItem("currentUserID");
      let commentsDiv = document.querySelector(".book-hero-comments");
      let commentField = prompt("Unesite komentar: ");

      if (commentField === null || commentField === "") return;

      var noviKomentar = new Comment(
        clickedBookID,
        localStorage.getItem("currentUserID"),
        commentField
      );

      fetch(
        `https://localhost:7116/api/Books/api/addcomment?bookID=${clickedBookID}&userID=${currentUserID}&comment=${commentField}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (commentsDiv) {
        noviKomentar.render(commentsDiv);
      }
    });
    var bookRating = ratingPara.getAttribute("book-rating");

    divElement.appendChild(oceniDugme);
    divElement.appendChild(komentarisiDugme);

    bookDiv.appendChild(imgElement);
    bookDiv.appendChild(titlePara);
    bookDiv.appendChild(authorPara);
    if (bookRating !== "-1" && bookRating != "-2")
      bookDiv.appendChild(ratingPara);
    bookDiv.appendChild(divElement);

    if (bookRating !== "-1") {
      const ukloniDugme = document.createElement("button");
      ukloniDugme.textContent = "Ukloni";
      ukloniDugme.setAttribute("book-id", this.bookID);

      ukloniDugme.addEventListener("click", function () {
        var clickedBookID = oceniDugme.getAttribute("book-id");
        let currentUserID = localStorage.getItem("currentUserID");

        if (bookRating == "-2") {
          fetch(
            `https://localhost:7116/api/Books/api/deleterecommendation?userID=${currentUserID}&bookID=${clickedBookID}`,
            {
              method: "DELETE",
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.text(); // Umesto response.json()
            })
            .then((data) => {
              console.log("Delete successful", data);
            })
            .catch((error) => {
              console.error(
                "There was a problem with your fetch operation:",
                error
              );
            });
          const knjigaMoja = vratiKnjiguPreporuka(clickedBookID);
          if (knjigaMoja) knjigaMoja.remove();
        } else {
          fetch(
            `https://localhost:7116/api/Books/api/deleterating?userID=${currentUserID}&bookID=${clickedBookID}`,
            {
              method: "DELETE",
            }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.text(); // Umesto response.json()
            })
            .then((data) => {
              console.log("Delete successful", data);
            })
            .catch((error) => {
              console.error(
                "There was a problem with your fetch operation:",
                error
              );
            });
          const knjigaMoja = vratiKnjiguMoje(clickedBookID);
          if (knjigaMoja) knjigaMoja.remove();
        }
      });

      divElement.appendChild(ukloniDugme);
    }

    targetDiv.appendChild(bookDiv);
  }
}

function proveriNaslov(x) {
  var h2Elements = document.querySelectorAll(".my-books-list .book h2");
  for (var i = 0; i < h2Elements.length; i++) {
    if (h2Elements[i].getAttribute("book-title") === x) {
      return false;
    }
  }
  return true;
}

function vratiOcenuP(x) {
  var h2Elements = document.querySelectorAll(".my-books-list .book h2");
  for (var i = 0; i < h2Elements.length; i++) {
    if (h2Elements[i].getAttribute("book-title") === x) {
      return h2Elements[i].parentElement;
    }
  }
  return null;
}

function vratiKnjiguMoje(x) {
  var buttons = document.querySelectorAll(
    ".my-books-list .book .dugmici button"
  );
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].getAttribute("book-id") === x) {
      return buttons[i].parentElement.parentElement;
    }
  }
  return null;
}

function vratiKnjiguPreporuka(x) {
  var buttons = document.querySelectorAll(
    ".books-list-recommended .book .dugmici button"
  );
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].getAttribute("book-id") === x) {
      return buttons[i].parentElement.parentElement;
    }
  }
  return null;
}
