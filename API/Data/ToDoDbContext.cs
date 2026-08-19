using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ToDoDbContext(DbContextOptions<ToDoDbContext> options) : DbContext(options)
{
    public DbSet<ToDo> ToDo { get; set; }
}
