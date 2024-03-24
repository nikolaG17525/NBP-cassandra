using CassandraDataLayer.QueryEntities;
using CassandraDataLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CassandraWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public string UserLogin([FromBody] AuthRequestModel authRequestModel)
        {
            string userID = DataProvider.LoginUser($"{authRequestModel.Email}", $"{authRequestModel.Password}");
            return userID;
        }
    }
}
