using Application.Interfaces;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces.IInterviewService;
using Application.DTOs.InterviewRequestDto;

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
        public async Task<IActionResult> StartInterview([FromForm] InterviewRequestDto interviewRequestDto)
        {
            var result = await _interviewService.StartInterviewAsync(interviewRequestDto);
            return Ok(result);
        }

        // [HttpPost("evaluate")]
        // public async Task<IActionResult> EvaluateInterview([FromBody] List<InterviewAnswerDto> responses)
        // {
        //     var result = await _interviewService.EvaluateInterviewAsync(
        //         responses.Select(r => (r.Question, r.Answer)).ToList()
        //     );
        //     return Ok(result);
        // }
    }

}
