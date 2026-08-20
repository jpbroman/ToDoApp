using API.Models;

namespace API.Data;

public static class DbSeeder
{
    public static void Seed(ToDoDbContext context)
    {
        // Finns det redan data gör vi ingenting
        if (context.ToDos.Any())
        {
            return;
        }

        var random = new Random();

        string[] headings =
        [
            "Handla mat",
            "Gå ut med hunden",
            "Träna",
            "Läs en bok",
            "Städa köket",
            "Betala räkningar",
            "Ring mamma",
            "Tvätta bilen",
            "Planera veckan",
            "Köp kaffe"
        ];

        string[] notes =
        [
            "Kom ihåg detta",
            "Gör detta så snart som möjligt",
            "Kan vänta några dagar",
            "Viktigt!",
            "Gör när du får tid"
        ];

        var todos = new List<ToDo>();

        for (int i = 0; i < 10; i++)
        {
            var created = DateOnly.FromDateTime(DateTime.Today);

            var doDate = created.AddDays(random.Next(0, 14));

            todos.Add(new ToDo
            {
                Heading = headings[i],
                Note = notes[random.Next(notes.Length)],
                Created = created,
                DoDate = doDate,
                Done = random.Next(2) == 1
            });
        }

        context.ToDos.AddRange(todos);
        context.SaveChanges();
    }
}
