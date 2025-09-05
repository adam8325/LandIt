namespace Domain.Entities;

public class ApplicationDraft
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public enum Style
    {
        Professional,
        Technical,
        Creative,
    }
 
}