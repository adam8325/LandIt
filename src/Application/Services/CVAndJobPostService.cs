using Application.Interfaces;

namespace Application.Services
{
    public class CvAndJobPostService: ICvAndJobPostService
    {
        private readonly IOpenAiService _openAiService;
        private readonly ISessionService _sessionService;

        public CvAndJobPostService(IOpenAiService openAiService, ISessionService sessionService)
        {
            _openAiService = openAiService;
            _sessionService = sessionService;
        }

        public async Task<string> AnalyzeCvAndJobPostingAsync(string cvContent, string jobPostingContent)
        {
            // Create new session
            var sessionId = _sessionService.CreateSession();
            
            // Analyze with OpenAI
            var analysis = await _openAiService.AnalyzeCvAndJobPostingAsync(cvContent, jobPostingContent);
            
            // Store everything in session
            _sessionService.StoreCvAndJobPosting(sessionId, cvContent, jobPostingContent, analysis);
            
            // Return session ID instead of analysis
            return sessionId;
        }
    }
}