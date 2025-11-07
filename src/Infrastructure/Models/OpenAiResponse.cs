namespace Infrastructure.Models
{
    public class OpenAiResponse
    {
        public List<Choice> Choices { get; set; } = new();
    }

    public class Choice
    {
        public Message Message { get; set; } = new();
    }

    public class Message
    {
        public string Role { get; set; } = "";
        public string Content { get; set; } = "";
    }
}
