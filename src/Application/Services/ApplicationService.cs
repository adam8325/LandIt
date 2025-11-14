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
            var cvText = await _fileProcessing.GetTextAsync(request.CvText, request.CvFile);
            var jobText = await _fileProcessing.GetTextAsync(request.JobPostingText, request.JobPostingFile);

            return await _aiService.GenerateApplicationAsync(cvText, jobText);
        }

    }
}
