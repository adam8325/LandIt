using Application.Interfaces;

namespace Application.Services
{
    public class ApplicationService
    {
        private readonly IOpenAIService _openAIService;

        public ApplicationService(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        public async Task<string> GenerateTemplateAsync(string cv, string jobPosting, string motivation, string style)
        {
            return await _openAIService.GenerateApplicationAsync(cv, jobPosting, motivation, style);
        }
    }
}
