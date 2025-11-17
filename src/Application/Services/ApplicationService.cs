using Application.Interfaces.IApplicationService;
using Application.Interfaces.IAIService;
using Application.DTOs.ApplicationResponse;
using Application.Interfaces.IFileProcessing;
using Microsoft.AspNetCore.Http;
using Application.DTOs.User;

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

        public async Task<GeneratedApplicationDto> GenerateApplication(UserDocumentDto dto)
        {

            if (dto.CvFile != null)
            {
                dto.CvText = await _fileProcessing.GetTextAsync(dto.CvText, dto.CvFile);
            }
            
            if (dto.JobPostingFile != null)
            {
                dto.JobPostingText = await _fileProcessing.GetTextAsync(dto.JobPostingText, dto.JobPostingFile);
            }

            return await _aiService.GenerateApplicationAsync(dto);
        }

    }
}
