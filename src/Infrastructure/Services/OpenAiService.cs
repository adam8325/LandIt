using System.Net.Http;
using System.Text;
using System.Text.Json;
using Application.Interfaces;

namespace Infrastructure.Services
{
    public class OpenAiService: IOpenAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _model = "gpt-4.1-mini";

        public OpenAiService(HttpClient httpClient)
        {
            _httpClient = httpClient;

            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
                ?? throw new InvalidOperationException("OPENAI_API_KEY not found");

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        }

        private async Task<string> CallOpenAiAsync(string prompt)
        {
            var body = new
            {
                model = _model,
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                max_tokens = 1000,
                temperature = 0.7
            };

            var response = await _httpClient.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            );

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            return doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString()!;
        }

        public async Task<string> AnalyzeCvAndJobPostingAsync(string cv, string jobPosting)
        {
            var prompt = $@"Analyser følgende CV og jobopslag og giv en kort vurdering:
            
                CV:
                {cv}

                Jobopslag:
                {jobPosting}";

            return await CallOpenAiAsync(prompt);
        }

        public Task<List<string>> GenerateMotivationIdeasAsync(string cv, string jobPosting)
            => throw new NotImplementedException();

        public Task<string> GenerateApplicationAsync(string cv, string jobPosting, string motivation, string style)
            => throw new NotImplementedException();
    }
}
