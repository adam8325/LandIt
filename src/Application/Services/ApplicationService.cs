using Application.Interfaces;
using Application.Services;

namespace Application.Services
{
    public class ApplicationService
    {
        private readonly IOpenAiService _openAiService;

        public ApplicationService(IOpenAiService openAiService)
        {
            _openAiService = openAiService;
        }

        public Task<string> GenerateApplicationAsync(string cv, string jobPosting, string motivation, string style)
        {
            throw new NotImplementedException();
        }

        public async Task<string> GenerateTemplateAsync(string cv, string jobPosting, string motivation, string style)
        {
            return await _openAiService.GenerateApplicationAsync(cv, jobPosting, motivation, style);
        }
    }
}
