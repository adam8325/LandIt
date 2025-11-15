using Application.Interfaces;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces.IInterviewService;
using Application.DTOs.InterviewRequestDto;
using Application.DTOs.Interview;

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
        public async Task<IActionResult> StartInterview([FromForm] InterviewStartRequestDto interviewRequestDto)
        {
            try
            {
                var result = await _interviewService.StartInterviewAsync(interviewRequestDto);
                return Ok(result);
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateInterview([FromBody] List<InterviewEvaluationRequestDto> responses)
        {
            try
            {
                var result = await _interviewService.EvaluateInterviewAsync(responses);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
            
        }
    }

}
