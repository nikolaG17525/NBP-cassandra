using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraDataLayer.QueryEntities
{
    public class Book
    {
        public string BookID { get; set; }
        public string Title { get; set; }
        public string About { get; set; }
        public string Author { get; set; }
        public string Url { get; set; }
        public int Rating { get; set; }
    }
}
