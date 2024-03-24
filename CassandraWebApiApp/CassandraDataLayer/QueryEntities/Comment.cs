using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CassandraDataLayer.QueryEntities
{
    public class Comment
    {
        public string BookID { get; set; }
        public string UserID { get; set; }
        public string CommentContent { get; set; }
    }
}
