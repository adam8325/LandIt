using Application.Interfaces;

namespace Application.Services
{
    public class CvAndJobPostService
    {
        private readonly IOpenAiService _openAiService;

        public CvAndJobPostService(IOpenAiService openAiService)
        {
            _openAiService = openAiService;
        }

        public async Task<string> UploadCvAndJobPostingAsync(string cvContent, string jobPostingContent)
        {
            
            return await _openAiService.AnalyzeCvAndJobPostingAsync(cvContent, jobPostingContent);
        }
    }
}
