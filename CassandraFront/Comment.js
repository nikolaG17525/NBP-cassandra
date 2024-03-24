export class Comment {
  constructor(bookID, userID, comment) {
    this.bookID = bookID;
    this.userID = userID;
    this.comment = comment;
  }

  render(targetDiv) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-div");

    const commentContent = document.createElement("p");
    commentContent.textContent = this.comment;
    commentDiv.appendChild(commentContent);

    targetDiv.appendChild(commentDiv);
  }
}
