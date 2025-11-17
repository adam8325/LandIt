using Application.DTOs.Interview;
using Application.DTOs.User;
using Application.Interfaces.IAIService;
using Application.Interfaces.IFileProcessing;
using Application.Interfaces.IInterviewService;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IAIService _aiService;
        private readonly IFileProcessing _fileProcessing;

        public InterviewService(IAIService aiService, IFileProcessing fileProcessing)
        {
            _aiService = aiService;
            _fileProcessing = fileProcessing;
        }

        public async Task<GeneratedInterviewDto> StartInterviewAsync(UserDocumentDto dto)
        {
            if (dto.CvFile != null)
            {
                dto.CvText = await _fileProcessing.GetTextAsync(dto.CvText, dto.CvFile);
            }
                
            if (dto.JobPostingFile != null)
            {
                dto.JobPostingText = await _fileProcessing.GetTextAsync(dto.JobPostingText, dto.JobPostingFile);
            }

            var aiResponse = await _aiService.GenerateInterviewAsync(dto);

            return aiResponse;
        }

        public async Task<string> TranscribeAnswerAsync(IFormFile audioFile)
        {
            using var stream = audioFile.OpenReadStream();
            return await _aiService.TranscribeAudioAsync(stream);
        }


        public async Task<EvaluationSummaryDto> EvaluateInterviewAsync(List<UserAnswerDto> responses)
        {
            // validate / sanitize if needed, then hand off to infrastructure AI service
            // (infrastructure builds prompt and returns parsed InterviewEvaluationResultDto)
            var result = await _aiService.EvaluateInterviewAsync(responses);
            return result;
        }
    }
}
