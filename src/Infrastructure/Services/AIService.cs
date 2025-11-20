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
using Application.DTOs.User;

namespace Infrastructure.Services
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AIService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["OpenAI:ApiKey"] ?? throw new ArgumentNullException("OpenAI API key not configured");
        }

        public async Task<GeneratedApplicationDto> GenerateApplicationAsync(UserDocumentDto dto)
        {
            
            var prompt = ApplicationPrompt.GetApplicationPrompt(dto.CvText!, dto.JobPostingText!);

            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<GeneratedApplicationDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new GeneratedApplicationDto();

            return parsedContent;
        }

        public async Task<GeneratedInterviewDto> GenerateInterviewAsync(UserDocumentDto dto)
        {
            var prompt = InterviewPrompts.GetInterviewStartPrompt(dto.CvText!, dto.JobPostingText!);
            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<GeneratedInterviewDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new GeneratedInterviewDto();

            return parsedContent;
        }

        public async Task<string> TranscribeAudioAsync(Stream audioStream)
        {
            using var content = new MultipartFormDataContent();
            content.Add(new StreamContent(audioStream), "file", "answer.wav");
            content.Add(new StringContent("whisper-1"), "model");

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/audio/transcriptions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            request.Content = content;

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadFromJsonAsync<JsonDocument>();
            return json?.RootElement.GetProperty("text").GetString() ?? "";
        }


         public async Task<EvaluationSummaryDto> EvaluateInterviewAsync(List<UserAnswerDto> responses)
        {
            var formattedAnswers = string.Join("\n", responses.Select(r => $"Spørgsmål: {r.Question}\nSvar: {r.Answer}\n"));
            var prompt = InterviewPrompts.GetInterviewEvaluationPrompt(responses);

            var content = await CallOpenAiAsync(prompt);
            content = CleanJsonString(content);

            var parsedContent = JsonSerializer.Deserialize<EvaluationSummaryDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new EvaluationSummaryDto();

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
