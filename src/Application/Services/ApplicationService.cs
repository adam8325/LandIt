using Application.Interfaces.IApplicationService;
using Application.Interfaces.IAIService;
using Application.DTOs.ApplicationResponse;
using Application.DTOs.ApplicationRequest;
using Application.Interfaces.IFileProcessing;
using Microsoft.AspNetCore.Http;

namespace Application.Services.ApplicationService
{
    public class ApplicationService : IApplicationService
    {
        private readonly IFileProcessing _fileProcessing;
        private readonly IAIService _aiService;

        public ApplicationService(IFileProcessing fileProcessing, IAIService aiService)
        {
            _fileProcessing = fileProcessing;
            _aiService = aiService;
        }

        public async Task<ApplicationResponseDto> ExecuteAsync(ApplicationRequestDto request)
        {
            var cvText = await GetTextAsync(request.CvText, request.CvFile);
            var jobText = await GetTextAsync(request.JobPostingText, request.JobPostingFile);

            return await _aiService.GenerateApplicationAsync(cvText, jobText);
        }

        private async Task<string> GetTextAsync(string? text, IFormFile? file)
        {
            if (!string.IsNullOrWhiteSpace(text))
                return text;

            if (file != null)
                return await _fileProcessing.ExtractTextAsync(file);

            throw new ArgumentException("Either text or file input must be provided.");
        }
    }
}
