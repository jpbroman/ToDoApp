using API.Data;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ToDosController(ToDoDbContext context) : ControllerBase
{
    private readonly ToDoDbContext _context = context;

    // 1. READ ALL: GET /api/todos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ToDo>>> GetAllTodo()
    {
        var todos = await _context.ToDos 
            .OrderBy(t => t.DoDate)
            .ToListAsync();

        return Ok(todos);
    }

    // 2. READ ONE: GET /api/todos/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ToDo>> GetToDo(int id)
    {
        var toDo = await _context.ToDos.FindAsync(id);

        return toDo ?? (ActionResult<ToDo>)NotFound($"Hittade ingen uppgift med ID {id}.");
    }

    // 3. CREATE: POST /api/todos
    [HttpPost]
    public async Task<ActionResult<ToDo>> CreateToDo(ToDo toDo)
    {
        // Sätt skapat-datumet till dagens datum automatiskt på servern
        toDo.Created = DateOnly.FromDateTime(DateTime.Today);

        _context.ToDos.Add(toDo);
        await _context.SaveChangesAsync();

        // Returnerar statuskod 201 Created samt URL till den nya resursen
        return CreatedAtAction(nameof(GetToDo), new { id = toDo.Id }, toDo);
    }

    // 4. UPDATE: PUT /api/todos/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateToDo(int id, ToDo toDo)
    {
        if (id != toDo.Id)
        {
            return BadRequest("ID i URL matchar inte objektets ID.");
        }

        // Informera EF Core om att objektet har ändrats
        _context.Entry(toDo).State = EntityState.Modified;

        // Förhindra att det ursprungliga skapat-datumet skrivs över/ändras vid uppdatering
        _context.Entry(toDo).Property(x => x.Created).IsModified = false;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ToDoExists(id))
            {
                return NotFound($"Uppgiften med ID {id} finns inte kvar.");
            }
            else
            {
                throw;
            }
        }

        return NoContent(); // Svarar 204 No Content vid lyckad uppdatering
    }

    // 5. DELETE: DELETE /api/todos/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteToDo(int id)
    {
        var toDo = await _context.ToDos.FindAsync(id);
        if (toDo == null)
        {
            return NotFound($"Uppgiften med ID {id} hittades inte.");
        }

        _context.ToDos.Remove(toDo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Hjälpmetod för att kontrollera om en ToDo existerar
    private bool ToDoExists(int id)
    {
        return _context.ToDos.Any(e => e.Id == id);
    }
}
