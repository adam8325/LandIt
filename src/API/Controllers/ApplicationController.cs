using Application.DTOs.User;
using Application.Interfaces.IApplicationService;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromForm] UserDocumentDto dto)
        {
            try
            {
                var result = await _applicationService.GenerateApplication(dto);
                return Ok(result);
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }

}