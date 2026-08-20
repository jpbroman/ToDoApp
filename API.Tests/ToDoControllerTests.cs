using API.Controllers;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace API.Tests;

public class ToDosControllerTests
{
    [Fact]
    public async Task GetAllTodo_ReturnerarAllaToDos()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        context.ToDos.AddRange(
            new ToDo
            {
                Id = 1,
                Heading = "Första uppgiften",
                Note = "Test",
                DoDate = new DateOnly(2026, 8, 21),
                Created = new DateOnly(2026, 8, 20),
                Done = false
            },
            new ToDo
            {
                Id = 2,
                Heading = "Andra uppgiften",
                Note = "Test",
                DoDate = new DateOnly(2026, 8, 22),
                Created = new DateOnly(2026, 8, 20),
                Done = true
            }
        );

        await context.SaveChangesAsync();

        var controller = new ToDosController(context);

        // Act
        var result = await controller.GetAllTodo();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);

        var todos = Assert.IsType<IEnumerable<ToDo>>(
            okResult.Value
            , exactMatch: false);

        Assert.Equal(2, todos.Count());
    }

    [Fact]
    public async Task GetAllTodo_SorterarEfterDoDate()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        context.ToDos.AddRange(
            new ToDo
            {
                Id = 1,
                Heading = "Sen uppgift",
                Note = "Test",
                DoDate = new DateOnly(2026, 8, 25),
                Created = new DateOnly(2026, 8, 20),
                Done = false
            },
            new ToDo
            {
                Id = 2,
                Heading = "Tidig uppgift",
                Note = "Test",
                DoDate = new DateOnly(2026, 8, 21),
                Created = new DateOnly(2026, 8, 20),
                Done = false
            }
        );

        await context.SaveChangesAsync();

        var controller = new ToDosController(context);

        // Act
        var result = await controller.GetAllTodo();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);

        var todos = Assert.IsType<IEnumerable<ToDo>>(
            okResult.Value
            , exactMatch: false).ToList();

        Assert.Equal(2, todos.Count);
        Assert.Equal(2, todos[0].Id);
        Assert.Equal(1, todos[1].Id);
    }

    [Fact]
    public async Task GetToDo_MedBefintligtId_ReturnerarTodo()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        context.ToDos.Add(new ToDo
        {
            Id = 10,
            Heading = "Testa hämtning",
            Note = "Min anteckning",
            DoDate = new DateOnly(2026, 8, 25),
            Created = new DateOnly(2026, 8, 20),
            Done = false
        });

        await context.SaveChangesAsync();

        var controller = new ToDosController(context);

        // Act
        var result = await controller.GetToDo(10);

        // Assert
        var todo = Assert.IsType<ToDo>(result.Value);

        Assert.Equal(10, todo.Id);
        Assert.Equal("Testa hämtning", todo.Heading);
        Assert.Equal("Min anteckning", todo.Note);
    }

    [Fact]
    public async Task GetToDo_MedOkantId_ReturnerarNotFound()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        // Act
        var result = await controller.GetToDo(999);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);

        Assert.Equal(
            "Hittade ingen uppgift med ID 999.",
            notFoundResult.Value
        );
    }

    [Fact]
    public async Task CreateToDo_SkaparTodo_OchSatterCreatedDatum()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        var todo = new ToDo
        {
            Heading = "Ny testuppgift",
            Note = "Skapad från test",
            DoDate = new DateOnly(2026, 8, 25),
            Created = new DateOnly(2000, 1, 1),
            Done = false
        };

        // Act
        var result = await controller.CreateToDo(todo);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(
            result.Result
        );

        var createdTodo = Assert.IsType<ToDo>(
            createdResult.Value
        );

        Assert.Equal("Ny testuppgift", createdTodo.Heading);
        Assert.Equal("Skapad från test", createdTodo.Note);
        Assert.Equal(
            DateOnly.FromDateTime(DateTime.Today),
            createdTodo.Created
        );

        Assert.NotEqual(0, createdTodo.Id);
    }
    [Fact]
    public async Task CreateToDo_SpararTodoIDatabasen()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        var todo = new ToDo
        {
            Heading = "Ska sparas",
            Note = "Kontrollera databasen",
            DoDate = new DateOnly(2026, 8, 30),
            Created = new DateOnly(2026, 1, 1),
            Done = false
        };

        // Act
        await controller.CreateToDo(todo);

        // Assert
        var savedTodo = await context.ToDos
            .SingleOrDefaultAsync(t => t.Heading == "Ska sparas");

        Assert.NotNull(savedTodo);
        Assert.Equal("Kontrollera databasen", savedTodo.Note);
        Assert.Equal(new DateOnly(2026, 8, 30), savedTodo.DoDate);
        Assert.False(savedTodo.Done);
    }

    [Fact]
    public async Task UpdateToDo_UppdaterarTodo_MenInteCreated()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var originalCreated = new DateOnly(2026, 8, 1);

        var todo = new ToDo
        {
            Heading = "Ursprunglig rubrik",
            Note = "Ursprunglig anteckning",
            Created = originalCreated,
            DoDate = new DateOnly(2026, 8, 20),
            Done = false
        };

        context.ToDos.Add(todo);
        await context.SaveChangesAsync();

        var id = todo.Id;

        // Simulerar att den ursprungliga requesten är avslutad
        // och att nästa request kommer med en ny instans.
        context.ChangeTracker.Clear();

        var updatedTodo = new ToDo
        {
            Id = id,
            Heading = "Ändrad rubrik",
            Note = "Ändrad anteckning",
            Created = new DateOnly(2000, 1, 1),
            DoDate = new DateOnly(2026, 9, 1),
            Done = true
        };

        var controller = new ToDosController(context);

        // Act
        var result = await controller.UpdateToDo(id, updatedTodo);

        // Assert
        Assert.IsType<NoContentResult>(result);

        var savedTodo = await context.ToDos
            .AsNoTracking()
            .SingleAsync(t => t.Id == id);

        Assert.Equal("Ändrad rubrik", savedTodo.Heading);
        Assert.Equal("Ändrad anteckning", savedTodo.Note);
        Assert.Equal(new DateOnly(2026, 9, 1), savedTodo.DoDate);
        Assert.True(savedTodo.Done);

        // Created ska inte kunna ändras via PUT
        Assert.Equal(originalCreated, savedTodo.Created);
    }

    [Fact]
    public async Task UpdateToDo_FelID_ReturnerarBadRequest()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        var todo = new ToDo
        {
            Id = 1,
            Heading = "Test",
            Note = "Anteckning",
            Created = DateOnly.FromDateTime(DateTime.Today),
            DoDate = DateOnly.FromDateTime(DateTime.Today),
            Done = false
        };

        // Act
        var result = await controller.UpdateToDo(99, todo);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.Equal(
            "ID i URL matchar inte objektets ID.",
            badRequest.Value
        );
    }

    [Fact]
    public async Task UpdateToDo_TodoFinnsInte_ReturnerarNotFound()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        var todo = new ToDo
        {
            Id = 99,
            Heading = "Test",
            Note = "Anteckning",
            Created = DateOnly.FromDateTime(DateTime.Today),
            DoDate = DateOnly.FromDateTime(DateTime.Today),
            Done = false
        };

        // Act
        var result = await controller.UpdateToDo(99, todo);

        // Assert
        var notFound = Assert.IsType<NotFoundObjectResult>(result);

        Assert.Equal(
            "Uppgiften med ID 99 finns inte kvar.",
            notFound.Value
        );
    }

    [Fact]
    public async Task DeleteToDo_BefintligTodo_TarBortTodo()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var todo = new ToDo
        {
            Heading = "Ska tas bort",
            Note = "Test",
            Created = new DateOnly(2026, 8, 20),
            DoDate = new DateOnly(2026, 8, 25),
            Done = false
        };

        context.ToDos.Add(todo);
        await context.SaveChangesAsync();

        var id = todo.Id;

        var controller = new ToDosController(context);

        // Act
        var result = await controller.DeleteToDo(id);

        // Assert
        Assert.IsType<NoContentResult>(result);

        var deletedTodo = await context.ToDos
            .AsNoTracking()
            .SingleOrDefaultAsync(t => t.Id == id);

        Assert.Null(deletedTodo);
    }

    [Fact]
    public async Task DeleteToDo_TodoFinnsInte_ReturnerarNotFound()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var controller = new ToDosController(context);

        // Act
        var result = await controller.DeleteToDo(999);

        // Assert
        var notFound = Assert.IsType<NotFoundObjectResult>(result);

        Assert.Equal(
            "Uppgiften med ID 999 hittades inte.",
            notFound.Value
        );
    }
}
