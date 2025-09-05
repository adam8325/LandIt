using Application.Interfaces;

namespace Application.Services
{
    public class MotivationService
    {
        private readonly IOpenAIService _openAIService;

        public MotivationService(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        public async Task<List<string>> GenerateIdeasAsync(string cv, string jobPosting)
        {
            return await _openAIService.GenerateMotivationIdeasAsync(cv, jobPosting);
        }
    }
}
