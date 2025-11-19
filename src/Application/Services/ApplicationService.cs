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
        private readonly UserDocumentDtoValidator _validator;

        public ApplicationService(IFileProcessing fileProcessing, IAIService aiService)
        {
            _fileProcessing = fileProcessing;
            _aiService = aiService;
            _validator = new UserDocumentDtoValidator();
        }

        public async Task<GeneratedApplicationDto> GenerateApplication(UserDocumentDto dto)
        {
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                 throw new FluentValidation.ValidationException(validationResult.Errors);
            }

            return await _aiService.GenerateApplicationAsync(dto);
        }

    }
}
