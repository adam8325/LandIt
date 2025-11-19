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
        private readonly UserDocumentDtoValidator _validator;
        private readonly UserAnswerDtoValidator _answerValidator;

        public InterviewService(IAIService aiService, IFileProcessing fileProcessing)
        {
            _aiService = aiService;
            _fileProcessing = fileProcessing;
            _validator = new UserDocumentDtoValidator();
            _answerValidator = new UserAnswerDtoValidator();
        }

        public async Task<GeneratedInterviewDto> StartInterviewAsync(UserDocumentDto dto)
        {
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                 throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            var aiResponse = await _aiService.GenerateInterviewAsync(dto);

            return aiResponse;            
        }

        public async Task<string> TranscribeAnswerAsync(IFormFile audioFile)
        {
            if (audioFile == null || audioFile.Length == 0)
            {
                throw new ArgumentException("Audio file is null or empty");
            }
            using var stream = audioFile.OpenReadStream();
            return await _aiService.TranscribeAudioAsync(stream);
        }


        public async Task<EvaluationSummaryDto> EvaluateInterviewAsync(List<UserAnswerDto> responses)
        {
            foreach (var response in responses)
            {
                var validationResult = await _answerValidator.ValidateAsync(response);
                if (!validationResult.IsValid)
                {
                    throw new FluentValidation.ValidationException(validationResult.Errors);
                }
            }
            
            var result = await _aiService.EvaluateInterviewAsync(responses);
            return result;
        }
    }
}
