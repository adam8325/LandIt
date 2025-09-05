using Application.Interfaces;

namespace Application.Services
{
    public class MotivationService
    {
        private readonly IOpenAiService _openAiService;

        public MotivationService(IOpenAiService openAiService)
        {
            _openAiService = openAiService;
        }

        public async Task<List<string>> GenerateIdeasAsync(string cv, string jobPosting)
        {
            return await _openAiService.GenerateMotivationIdeasAsync(cv, jobPosting);
        }
    }
}
