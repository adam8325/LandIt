using Application.DTOs.Interview;
using Application.DTOs.InterviewRequestDto;
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

        public async Task<InterviewStartResponseDto> StartInterviewAsync(InterviewStartRequestDto interviewRequestDto)
        {
            var cv = await _fileProcessing.GetTextAsync(interviewRequestDto.CvText, interviewRequestDto.CvFile);
            var job = await _fileProcessing.GetTextAsync(interviewRequestDto.JobPostingText, interviewRequestDto.JobPostingFile);

            var aiResponse = await _aiService.GenerateInterviewAsync(cv, job);

            return aiResponse;
        }


        public async Task<InterviewEvaluationResultDto> EvaluateInterviewAsync(List<InterviewEvaluationRequestDto> responses)
        {
            // validate / sanitize if needed, then hand off to infrastructure AI service
            // (infrastructure builds prompt and returns parsed InterviewEvaluationResultDto)
            var result = await _aiService.EvaluateInterviewAsync(responses);
            return result;
        }
    }
}
