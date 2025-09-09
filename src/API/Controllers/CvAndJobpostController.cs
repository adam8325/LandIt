using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{[ApiController]
[Route("api/[controller]")]
public class CvAndJobPostController : ControllerBase
{
    private readonly IOpenAiService _service;
    private readonly IFileProcessingService _fileProcessingService;

    public CvAndJobPostController(IOpenAiService service, IFileProcessingService fileProcessingService)
    {
        _service = service;
        _fileProcessingService = fileProcessingService;
    }

    // === FORM upload (med fil) ===
    [HttpPost("analyze/form")]
    public async Task<IActionResult> AnalyzeForm([FromForm] UploadRequest request)
    {
        try
        {
            if (request.CvFile == null || string.IsNullOrEmpty(request.JobPostingContent))
                return BadRequest("CV-fil og jobopslag skal angives");

            var cvContent = await _fileProcessingService.ExtractTextFromFileAsync(request.CvFile);
            var analysis = await _service.AnalyzeCvAndJobPostingAsync(cvContent, request.JobPostingContent);

            return Ok(new { analysis });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // === JSON upload (kun tekst) ===
    [HttpPost("analyze/json")]
    public async Task<IActionResult> AnalyzeJson([FromBody] UploadRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.CvContent) || string.IsNullOrEmpty(request.JobPostingContent))
                return BadRequest("CV-tekst og jobopslag er påkrævet");

            var analysis = await _service.AnalyzeCvAndJobPostingAsync(request.CvContent, request.JobPostingContent);

            return Ok(new { analysis });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class UploadRequest
{
    public IFormFile? CvFile { get; set; }
    public string? CvContent { get; set; } = string.Empty;
    public string JobPostingContent { get; set; } = string.Empty;
}

}