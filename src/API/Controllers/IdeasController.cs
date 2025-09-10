using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IdeasController : ControllerBase
    {
        private readonly IIdeasService _ideasService;

        public IdeasController(IIdeasService ideasService)
        {
            _ideasService = ideasService;
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] IdeasRequest req)
        {
            await _ideasService.UpdateMotivationAsync(req.SessionId, req.Motivation, req.Experience);
            return Ok();
        }

        [HttpGet("generate/{sessionId}/{type}")]
        public async Task<IActionResult> Generate(string sessionId, string type)
        {
            var ideas = await _ideasService.GenerateIdeasAsync(sessionId, type);
            return Ok(new { ideas });
        }
    }

    public class IdeasRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string Motivation { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
    }
}