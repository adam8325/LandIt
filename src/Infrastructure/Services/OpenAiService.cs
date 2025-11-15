using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;
using Application.DTOs.ApplicationResponse;
using Application.Interfaces;
using Application.Interfaces.IAIService;
using Microsoft.Extensions.Configuration;
using Application.DTOs.Interview;
using Infrastructure.Prompts;

namespace Infrastructure.Services
{
    public class OpenAiService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenAiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["OpenAI:ApiKey"] ?? throw new ArgumentNullException("OpenAI API key not configured");
        }

        public async Task<ApplicationResponseDto> GenerateApplicationAsync(string cvText, string jobPostingText)
        {
            var prompt = ApplicationPrompt.GetApplicationPrompt(cvText, jobPostingText);

            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<ApplicationResponseDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new ApplicationResponseDto();

            return parsedContent;
        }

        public async Task<InterviewStartResponseDto> GenerateInterviewAsync(string cvText, string jobPostingText)
        {
            var prompt = InterviewPrompts.GetInterviewStartPrompt(cvText, jobPostingText);
            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<InterviewStartResponseDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new InterviewStartResponseDto();

            return parsedContent;
        }

         public async Task<InterviewEvaluationResultDto> EvaluateInterviewAsync(List<InterviewEvaluationRequestDto> responses)
        {
            var formattedAnswers = string.Join("\n", responses.Select(r => $"Spørgsmål: {r.Question}\nSvar: {r.Answer}\n"));
            var prompt = InterviewPrompts.GetInterviewEvaluationPrompt(responses);

            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<InterviewEvaluationResultDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new InterviewEvaluationResultDto();

            return parsedContent;
        }


        /*HELPER METHODS*/


        private async Task<string> CallOpenAiAsync(string prompt)
        {
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[] { new { role = "user", content = prompt } }
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            requestMessage.Content = JsonContent.Create(requestBody);

            var response = await _httpClient.SendAsync(requestMessage);
            response.EnsureSuccessStatusCode();

            using var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());

            return json.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";
        }


        private static string CleanJsonString(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                return content;

            // Fjern markdown-kodeblokke
            content = content.Replace("```json", "", StringComparison.OrdinalIgnoreCase)
                            .Replace("```", "");

            // Trim mellemrum og linjeskift
            content = content.Trim();

            // Fjern uønskede escape-tegn
            if (content.StartsWith("\"") && content.EndsWith("\""))
                content = content.Trim('"');

            return content;
        }

    }
}
