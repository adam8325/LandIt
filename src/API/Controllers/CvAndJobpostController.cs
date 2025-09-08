using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CvAndJobPostController : ControllerBase
    {
        private readonly IOpenAiService _service;

        public CvAndJobPostController(IOpenAiService service)
        {
            _service = service;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze([FromBody] UploadRequest request)
        {
            var analysis = await _service.AnalyzeCvAndJobPostingAsync(request.CvContent, request.JobPostingContent);
            return Ok(new { analysis });
        }
    }

    public class UploadRequest
    {
        public string CvContent { get; set; } = string.Empty;
        public string JobPostingContent { get; set; } = string.Empty;
    }
}
