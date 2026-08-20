using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        const string username = "admin";
        const string password = "Qwe123?";

        var user = await userManager.FindByNameAsync(username);

        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = username
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                throw new Exception(
                    "Kunde inte skapa admin: " +
                    string.Join(", ", result.Errors.Select(e => e.Description))
                );
            }
        }
    }
}
