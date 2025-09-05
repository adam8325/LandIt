using Application.Interfaces;

namespace Application.Services
{
    public class CVAndJobPostService
    {
        private readonly IOpenAIService _openAIService;

        public CVAndJobPostService(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        public async Task<string> UploadCVAndJobPostingAsync(string cvContent, string jobPostingContent)
        {
            // fx returnere et thread_id fra OpenAI
            return await _openAIService.AnalyzeCVAndJobPostingAsync(cvContent, jobPostingContent);
        }
    }
}
