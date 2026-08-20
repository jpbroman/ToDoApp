
using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ToDoDbContext(DbContextOptions<ToDoDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<ToDo> ToDos { get; set; }
}
