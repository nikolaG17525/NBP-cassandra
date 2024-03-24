using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraDataLayer.QueryEntities
{
    public class Rating
    {
        public string UserID { get; set; }
        public int BookRating { get; set; }
        public string About { get; set; }
        public string Author { get; set; }
        public string BookID { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }

    }
}
