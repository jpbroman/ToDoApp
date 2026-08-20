using API.Controllers;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace API.Tests;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_GiltigaUppgifter_ReturnerarToken()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            null!,
            new PasswordHasher<ApplicationUser>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        var user = new ApplicationUser
        {
            UserName = "testuser"
        };

        await userManager.CreateAsync(user, "Test123!");

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "DettaArEnLangTestNyckelForJwt123456789",
                ["Jwt:Issuer"] = "ToDoApp",
                ["Jwt:Audience"] = "ToDoWeb"
            })
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new LoginRequest(
            "testuser",
            "Test123!");

        // Act
        var result = await controller.Login(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.NotNull(okResult.Value);

        var tokenProperty = okResult.Value
            .GetType()
            .GetProperty("token");

        Assert.NotNull(tokenProperty);

        var token = tokenProperty!.GetValue(okResult.Value);

        Assert.NotNull(token);
        Assert.False(string.IsNullOrWhiteSpace(token.ToString()));
    }

    [Fact]
    public async Task Login_FelAnvandarnamn_ReturnerarUnauthorized()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            null!,
            new PasswordHasher<ApplicationUser>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "DettaArEnLangTestNyckelForJwt123456789",
                ["Jwt:Issuer"] = "ToDoApp",
                ["Jwt:Audience"] = "ToDoWeb"
            })
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new LoginRequest(
            "finnsinte",
            "Test123!");

        // Act
        var result = await controller.Login(request);

        // Assert
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);

        Assert.NotNull(unauthorized.Value);

        var messageProperty = unauthorized.Value
            .GetType()
            .GetProperty("message");

        Assert.NotNull(messageProperty);

        var message = messageProperty!.GetValue(unauthorized.Value);

        Assert.Equal(
            "Fel användare eller lösenord",
            message
        );
    }

    [Fact]
    public async Task Login_FelLosenord_ReturnerarUnauthorized()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var loggerFactory = LoggerFactory.Create(builder => { });

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            null!,
            new PasswordHasher<ApplicationUser>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            loggerFactory.CreateLogger<UserManager<ApplicationUser>>());

        var user = new ApplicationUser
        {
            UserName = "testuser"
        };

        await userManager.CreateAsync(user, "Ratt123!");

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "DettaArEnLangTestNyckelForJwt123456789",
                ["Jwt:Issuer"] = "ToDoApp",
                ["Jwt:Audience"] = "ToDoWeb"
            })
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new LoginRequest(
            "testuser",
            "Fel123!");

        // Act
        var result = await controller.Login(request);

        // Assert
        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);

        Assert.NotNull(unauthorized.Value);

        var messageProperty = unauthorized.Value
            .GetType()
            .GetProperty("message");

        Assert.NotNull(messageProperty);

        var message = messageProperty!.GetValue(unauthorized.Value);

        Assert.Equal(
            "Fel användare eller lösenord",
            message
        );
    }

    [Fact]
    public async Task Register_NyAnvandare_ReturnerarOk()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var loggerFactory = LoggerFactory.Create(builder => { });

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            null!,
            new PasswordHasher<ApplicationUser>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            loggerFactory.CreateLogger<UserManager<ApplicationUser>>());

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new RegisterRequest(
            "nyanvandare",
            "Test123!");

        // Act
        var result = await controller.Register(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.NotNull(okResult.Value);

        var messageProperty = okResult.Value
            .GetType()
            .GetProperty("message");

        Assert.NotNull(messageProperty);

        var message = messageProperty!.GetValue(okResult.Value);

        Assert.Equal(
            "Användaren är skapad",
            message
        );

        // Kontrollera att användaren faktiskt skapades
        var createdUser = await userManager.FindByNameAsync("nyanvandare");

        Assert.NotNull(createdUser);
        Assert.Equal("nyanvandare", createdUser.UserName);
    }

    [Fact]
    public async Task Register_BefintligAnvandare_ReturnerarBadRequest()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var loggerFactory = LoggerFactory.Create(builder => { });

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            null!,
            new PasswordHasher<ApplicationUser>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            loggerFactory.CreateLogger<UserManager<ApplicationUser>>());

        var existingUser = new ApplicationUser
        {
            UserName = "testuser"
        };

        await userManager.CreateAsync(
            existingUser,
            "Test123!");

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new RegisterRequest(
            "testuser",
            "Annat123!");

        // Act
        var result = await controller.Register(request);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.NotNull(badRequest.Value);

        var messageProperty = badRequest.Value
            .GetType()
            .GetProperty("message");

        Assert.NotNull(messageProperty);

        var message = messageProperty!.GetValue(badRequest.Value);

        Assert.Equal(
            "Användarnamnet är redan upptaget",
            message
        );
    }

    [Fact]
    public async Task Register_OgiltigtLosenord_ReturnerarBadRequest()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ToDoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new ToDoDbContext(options);

        var userStore = new UserStore<ApplicationUser>(context);

        var loggerFactory = LoggerFactory.Create(builder => { });

        var passwordValidators =
            new List<IPasswordValidator<ApplicationUser>>
            {
                new PasswordValidator<ApplicationUser>()
            };

        var identityOptions = new IdentityOptions();

        identityOptions.Password.RequiredLength = 8;
        identityOptions.Password.RequireDigit = true;
        identityOptions.Password.RequireUppercase = true;
        identityOptions.Password.RequireLowercase = true;
        identityOptions.Password.RequireNonAlphanumeric = false;

        var userManager = new UserManager<ApplicationUser>(
            userStore,
            Options.Create(identityOptions),
            new PasswordHasher<ApplicationUser>(),
            null!,
            passwordValidators,
            null!,
            null!,
            null!,
            loggerFactory.CreateLogger<UserManager<ApplicationUser>>());

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var controller = new AuthController(
            userManager,
            configuration);

        var request = new RegisterRequest(
            "testuser",
            "123");

        // Act
        var result = await controller.Register(request);

        // Assert
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);

        Assert.NotNull(badRequest.Value);

        var messageProperty = badRequest.Value
            .GetType()
            .GetProperty("message");

        Assert.NotNull(messageProperty);

        var message = messageProperty!.GetValue(badRequest.Value);

        Assert.NotNull(message);
        Assert.NotEmpty(message.ToString()!);

        // Användaren ska inte ha skapats
        var createdUser = await userManager.FindByNameAsync("testuser");

        Assert.Null(createdUser);
    }
}