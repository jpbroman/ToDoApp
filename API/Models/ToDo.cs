namespace API.Models;

public class ToDo
{

    public int Id { get; set; }
    public string Heading { get; set; } = "";
    public string Note { get; set; } = "";
    public DateOnly Created { get; set; }
    public DateOnly DoDate { get; set; }
    public Boolean Done { get; set; } = false;

}
