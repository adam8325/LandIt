using Application.Interfaces;

namespace Application.Services
{
    public class IdeasService : IIdeasService
    {
        private readonly ISessionService _sessionService;
        private readonly IOpenAiService _openAiService;

        public IdeasService(ISessionService sessionService, IOpenAiService openAiService)
        {
            _sessionService = sessionService;
            _openAiService = openAiService;
        }

        public async Task UpdateMotivationAsync(string sessionId, string motivation, string experience)
        {
            _sessionService.UpdateMotivation(sessionId, motivation, experience);
        }

        public async Task<List<string>> GenerateIdeasAsync(string sessionId, string type)
        {
            var session = _sessionService.GetSessionData(sessionId);
            if (session == null)
                throw new Exception("Session not found");

            return await _openAiService.GenerateIdeasAsync(session.Cv, session.JobPosting, type);
        }
    }
}