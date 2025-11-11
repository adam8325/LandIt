using Application.Interfaces;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces.IInterviewService;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewController(IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartInterview([FromForm] string? cvText, IFormFile? cvFile, [FromForm] string? jobText, IFormFile? jobFile)
        {
            var result = await _interviewService.StartInterviewAsync(cvText, cvFile, jobText, jobFile);
            return Ok(result);
        }

        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateInterview([FromBody] List<InterviewAnswerDto> responses)
        {
            var result = await _interviewService.EvaluateInterviewAsync(
                responses.Select(r => (r.Question, r.Answer)).ToList()
            );
            return Ok(result);
        }
    }

}
