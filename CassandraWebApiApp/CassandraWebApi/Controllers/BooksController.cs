using CassandraDataLayer.QueryEntities;
using CassandraDataLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CassandraWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        [HttpGet("api/book")]
        public Book GetBook(string bookID)
        {
            Book book = DataProvider.GetBook(bookID);
            return book;
        }

        [HttpGet("api/books")]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            List<Book> books = DataProvider.GetBooks();
            return Ok(books);
        }
        
        [HttpGet("api/mybooks")]
        public ActionResult<IEnumerable<Book>> GetMyBooks(string userID)
        {
            List<Book> books = DataProvider.GetMyBooks(userID);
            return Ok(books);
        }

        [HttpGet("api/recommendedbooks")]
        public ActionResult<IEnumerable<Book>> GetRecommendedBooks(string userID)
        {
            List<Book> books = DataProvider.GetRecommendedBooks(userID);
            return Ok(books);
        }

        [HttpGet("api/comments")]
        public ActionResult<IEnumerable<Comment>> GetComments(string bookID)
        {
            List<Comment> comments = DataProvider.GetComments(bookID);
            return Ok(comments);
        }

        [HttpPost("api/addrating")]
        public IActionResult AddRating([FromBody] Rating rating)
        {
            try
            {
                DataProvider.AddRating(rating);
                return Ok("Rating successfully added.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("api/addcomment")]
        public IActionResult AddComment(string bookID, string userID, string comment)
        {
            try
            {
                DataProvider.AddComment(bookID, userID, comment);
                return Ok("Comment successfully added.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("api/deleterating")]
        public IActionResult DeleteRating(string userID, string bookID)
        {
            try
            {
                DataProvider.DeleteRating(userID, bookID);
                return Ok("Rating successfully removed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("api/deleterecommendation")]
        public IActionResult DeleteRecommendation(string userID, string bookID)
        {
            try
            {
                DataProvider.DeleteRecommendation(userID, bookID);
                return Ok("Recommendation successfully removed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("api/changerating")]
        public IActionResult ChangeRating([FromBody] Rating rating)
        {
            try
            {
                DataProvider.AddRating(rating);
                return Ok("Rating successfully changed.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
