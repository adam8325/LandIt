using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;

[ApiController]
[Route("api/test")]
public class OpenAiTestController : ControllerBase
{
    private readonly OpenAIClient _client;

    public OpenAiTestController(OpenAIClient client)
    {
        _client = client;
    }

    [HttpGet("hello")]
    public async Task<IActionResult> Hello()
    {
        var chat = _client.GetChatClient("gpt-4o-mini");
        var response = await chat.CompleteChatAsync("Sig hej til mig på dansk.");
        return Ok(response.Value.Content[0].Text);
    }
}
