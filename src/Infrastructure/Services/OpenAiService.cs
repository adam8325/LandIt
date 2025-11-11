using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;
using Application.DTOs.ApplicationResponse;
using Application.Interfaces;
using Application.Interfaces.IAIService;
using Infrastructure.Models;
using Microsoft.Extensions.Configuration;
using Application.DTOs.Interview;

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

        public async Task<InterviewOutputDto> GenerateInterviewQuestionsAsync(string prompt)
        {
            var response = await CallOpenAiAsync(prompt);
            var content = response.Choices.FirstOrDefault()?.Message?.Content ?? "";

            var parsed = JsonSerializer.Deserialize<InterviewOutputDto>(CleanJsonString(content), new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new InterviewOutputDto();

            return parsed;
        }

        public async Task<OverallInterviewDto> EvaluateInterviewAsync(string prompt)
        {
            var response = await CallOpenAiAsync(prompt);
            var content = response.Choices.FirstOrDefault()?.Message?.Content ?? "";

            var parsed = JsonSerializer.Deserialize<OverallInterviewDto>(CleanJsonString(content), new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new OverallInterviewDto();

            return parsed;
        }

        private async Task<OpenAiResponse> CallOpenAiAsync(string prompt)
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

            return await response.Content.ReadFromJsonAsync<OpenAiResponse>() 
                ?? throw new InvalidOperationException("Failed to parse OpenAI response");
        }


        public async Task<ApplicationResponse> GenerateApplicationAsync(string cv, string jobPosting)
        {
            var prompt = $$"""
            Du er en dansk, professionel jobcoach med stor erfaring i CV og jobansøgninger, og du ved, hvordan man skriver en effektiv ansøgning, og hvad jobmarkedet efterspørger. Opstil ansøgningen og email udkasten professionelt med passende formatering og mellemrum mellem afsnit. MatchScoren skal være en realistisk vurdering af, hvor godt ansøgningen matcher jobopslaget baseret på færdigheder, erfaring, uddannelse og andre relevante faktorer. Analysér følgende CV og jobopslag:
            ---
            CV:
            {{{cv}}}
            ---
            Jobopslag:
            {{{jobPosting}}}

            Returnér kun gyldig JSON uden ``` eller markdown-formatering.
            Returnér svaret udelukkende i JSON-format med følgende struktur:
            {
                "matchScore": (et tal mellem 0 og 100), der angiver, hvor godt ansøgningen matcher jobopslaget,
                "emailDraft": "kort e-mail der fanger essensen af ansøgningen og jobopslaget. Du vækker modtagerens interesse og opfordrer til at læse den fulde ansøgning. Start ud med 'Kære [Virksomhedens Navn], efterfulgt af dobbelt linjeskift'",
                "applicationText": "Den fulde ansøgning. Start ud med 'Kære [Virksomhedens Navn], efterfulgt af dobbelt linjeskift'. Undlad at nævne email, adresse eller telefonnummer i ansøgningen. Afslut med, 'Med venlig hilsen, [Brugerens Navn]'"
            }
            """;


            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            requestMessage.Content = JsonContent.Create(requestBody);

            var response = await _httpClient.SendAsync(requestMessage);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadFromJsonAsync<OpenAiResponse>();
            if (jsonResponse == null)
                throw new InvalidOperationException("Failed to parse OpenAI response");

            return ParseResponse(jsonResponse);
        }

        

        private ApplicationResponse ParseResponse(OpenAiResponse openAiResponse)
        {
            var content = openAiResponse.Choices.FirstOrDefault()?.Message?.Content;

            if (string.IsNullOrWhiteSpace(content))
                throw new InvalidOperationException("No content returned from OpenAI");

            content = CleanJsonString(content); 

            try
            {
                // Expect the model to return valid JSON
                var parsed = JsonSerializer.Deserialize<ApplicationResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (parsed == null)
                    throw new InvalidOperationException("Could not parse response into ApplicationResponse");

                return parsed;
            }
            catch
            {
                // Fallback in case AI returned plain text instead of JSON
                return new ApplicationResponse
                {
                    ApplicationText = content,
                    EmailDraft = "Kunne ikke parse JSON – tjek model-output",
                    MatchScore = 0
                };
            }
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

            // Fjern evt. uønskede escape-tegn
            if (content.StartsWith("\"") && content.EndsWith("\""))
                content = content.Trim('"');

            return content;
        }

    }
}
