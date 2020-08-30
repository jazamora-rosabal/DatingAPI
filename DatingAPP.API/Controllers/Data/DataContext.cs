using DatingAPP.API.Controllers.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAPP.API.Controllers.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options){}

        public DbSet<Value> Values { get; set; }
    }
}