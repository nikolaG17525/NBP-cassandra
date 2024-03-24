using Cassandra;
using CassandraDataLayer.QueryEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CassandraDataLayer
{
    public static class DataProvider
    {
        #region Book
        public static Book GetBook(string bookID)
        {
            ISession session = SessionManager.GetSession();
            Book book = new Book();


            if (session == null)
                return null;

            var bookData = session.Execute($"select * from books WHERE book_id = '{bookID}'").FirstOrDefault();

            book.BookID = bookData["book_id"].ToString();
            book.Author = bookData["author"].ToString();
            book.Title = bookData["title"].ToString();
            book.About = bookData["about"].ToString();
            book.Url = bookData["url"].ToString();
                           
            return book;
        }
        public static List<Book> GetBooks()
        {
            ISession session = SessionManager.GetSession();
            List<Book> books = new List<Book>();


            if (session == null)
                return null;



            var booksData = session.Execute("select * from books LIMIT 45");

            foreach (var bookData in booksData)
            {
                Book book = new Book();
                book.BookID = bookData["book_id"].ToString();
                book.Author = bookData["author"].ToString();
                book.Title = bookData["title"].ToString();
                book.About = bookData["about"].ToString();
                book.Url = bookData["url"].ToString();
                books.Add(book);
            }

            Random rand = new Random();
            int randomBroj = rand.Next(0, 41);

            return books.Skip(randomBroj).Take(5).ToList();
        }

        public static List<Book> GetRecommendedBooks(string userID)
        {
            ISession session = SessionManager.GetSession();
            List<Book> books = new List<Book>();

            if (session == null)
                return null;

            var booksData = session.Execute($"select * from recommended_books WHERE user_id = '{userID}' LIMIT 5");

            foreach (var bookData in booksData)
            {
                Book book = new Book();
                book.BookID = bookData["book_id"].ToString();
                book.Author = bookData["author"].ToString();
                book.Title = bookData["title"].ToString();
                book.About = bookData["about"].ToString();
                book.Url = bookData["url"].ToString();
                books.Add(book);
            }
            /*
            Random rand = new Random();
            int randomBroj = rand.Next(0, 41);
            */
            return books;
        }

        public static List<Book> GetMyBooks(string userID)
        {
            ISession session = SessionManager.GetSession();
            List<Book> books = new List<Book>();


            if (session == null)
                return null;

            var booksData = session.Execute($"SELECT * FROM ratings_by_user WHERE user_id = '{userID}' LIMIT 5");


            foreach (var bookData in booksData)
            {
                Book book = new Book();
                book.BookID = bookData["book_id"].ToString();
                book.Author = bookData["author"].ToString();
                book.Title = bookData["title"].ToString();
                book.About = bookData["about"].ToString();
                book.Url = bookData["url"].ToString();
                book.Rating = int.Parse(bookData["rating"].ToString());
                books.Add(book);
            }

            return books;
        }

        public static List<Comment> GetComments(string bookID)
        {
            ISession session = SessionManager.GetSession();
            List<Comment> comments = new List<Comment>();


            if (session == null)
                return null;

            var commentsData = session.Execute($"select * from comments_by_book WHERE book_id = '{bookID}'");


            foreach (var commentData in commentsData)
            {
                Comment comment = new Comment();
                comment.CommentContent = commentData["comment"].ToString();
                comment.BookID = commentData["book_id"].ToString();
                comment.UserID = commentData["user_id"].ToString();
                comments.Add(comment);
                
            }

            return comments;
        }

        public static void AddRating(Rating rating)
        {
            ISession session = SessionManager.GetSession();

            if (session == null)
                return;

            session.Execute($"insert into ratings_by_user (user_id, rating, about, author, book_id, title, url)  values ('{rating.UserID}', {rating.BookRating}, '{rating.About}', '{rating.Author}', '{rating.BookID}', '{rating.Title}', '{rating.Url}')");
            session.Execute($"insert into ratings_by_book (book_id, user_id, rating)  values ('{rating.BookID}', '{rating.UserID}', {rating.BookRating})");
            session.Execute($"delete from recommended_books where user_id = '{rating.UserID}' and book_id = '{rating.BookID}'");

            var compatibleUsers = session.Execute($"SELECT * FROM ratings_by_book WHERE book_id = '{rating.BookID}' LIMIT 5;");
            List<string> korisnici =  new List<string>();

            foreach (var compatibleUser in compatibleUsers)
            {
                if (compatibleUser["user_id"].ToString() != rating.UserID) 
                    korisnici.Add(compatibleUser["user_id"].ToString());
            }
       
            foreach (var korisnik in korisnici)
            {
                var preporuke = session.Execute($"select * from ratings_by_user WHERE user_id = '{korisnik}'");
                foreach (var preporuka in preporuke) 
                {
                    if (preporuka["book_id"].ToString() != rating.BookID)
                        session.Execute($"insert into recommended_books (user_id, book_id, about, author, title, url)  values ('{rating.UserID}', '{preporuka["book_id"].ToString()}', '{preporuka["about"].ToString()}', '{preporuka["author"].ToString()}', '{preporuka["title"].ToString()}', '{preporuka["url"].ToString()}')");
                }
            }
        }

        public static void AddComment(string bookID, string userID, string comment)
        {
            ISession session = SessionManager.GetSession();

            if (session == null)
                return;

            DateTime now = DateTime.Now; 
            string vremeString = now.ToString();

            RowSet commentData = session.Execute($"insert into comments_by_book (book_id, user_id, time, comment)  values ('{bookID}', '{userID}', '{vremeString}', '{comment}')");

        }

        public static void DeleteRating(string userID, string bookID)
        {
            ISession session = SessionManager.GetSession();

            if (session == null)
                return;

            session.Execute($"delete from ratings_by_user where user_id = '{userID}' and book_id = '{bookID}'");
            session.Execute($"delete from ratings_by_book where book_id = '{bookID}' and user_id = '{userID}'");
        }

        public static void DeleteRecommendation(string userID, string bookID)
        {
            ISession session = SessionManager.GetSession();

            if (session == null)
                return;

            session.Execute($"delete from recommended_books where user_id = '{userID}' and book_id = '{bookID}'");
        }


        #endregion

        #region User
        public static string LoginUser(string email, string password)
        {
            ISession session = SessionManager.GetSession();
            
            if (session == null)
                return null;

            Row red = session.Execute($"select * from \"user_by_email\" where \"email\"='{email}'").FirstOrDefault();
            if (red != null)
            {
                string sifra = red["password"].ToString();
                string user_id = red["user_id"].ToString();
                if (password == sifra) return user_id;
                return "Pogresna sifra";
            } 

            return "Pogresna email adresa";
        }

        public static string RegisterUser(string email, string password)
        {
            ISession session = SessionManager.GetSession();
            Guid userId = Guid.NewGuid();

            if (session == null)
                return null;

            session.Execute($"insert into \"user_by_email\" (email, password, user_id)  values ('{email}', '{password}', '{userId}')");

            return "Uspesno dodat korisnik";
        }
        #endregion  

        
    }
}
