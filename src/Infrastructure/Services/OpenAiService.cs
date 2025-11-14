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

        public async Task<InterviewStartResponseDto> GenerateInterviewAsync(string cvText, string jobPostingText)
        {
            var prompt = $$"""
             Du er en professionel HR-rekrutteringskonsulent for virksomheden, der nævnes i jobopslaget. 
            Analysér følgende CV og jobopslag, og generér 2 relevante interviewspørgsmål.
            Spørgsmålene skal være på dansk, realistiske og målrettet stillingen. Spørgsmålene skal være detaljerede og udfordrende, så de tester kandidatens færdigheder og erfaringer i forhold til jobopslaget. Hav fokus på både tekniske og bløde færdigheder. Tag udgangspunkt i både CV og jobopslag for at skabe relevante spørgsmål.
            Ud fra CV og jobopslag, skal du også generere en skarp elevator pitch, der taler ind til de vigtigste kvalifikationer og erfaringer i CV'et, som matcher jobopslaget. Opstil pitchen professionelt med passende afsnit og mellemrum imellem afsnit. Gør den fængende og overbevisende for en HR-medarbejder, og giv den gerne noget personlighed.
            Endelig skal du give et realistisk skøn over den forventede løn baseret på kandidatens alder, erfaring, uddannelse, område og stillingstype.


            Returnér KUN gyldig JSON i dette format:
            {
              "introduction": "kort introduktion på 1 linje som HR-medarbejderen ville introducere interviewet med",
              "questions": ["Spørgsmål 1...", "Spørgsmål 2...", ...],
              "elevatorPitch": "elevator pitch tekst",
              "salaryEstimate": eks. "40.000-45.000"
            }

            CV:
            {{cvText}}

            Jobopslag:
            {{jobPostingText}}
            """;

            var openAi = await CallOpenAiAsync(prompt);
            var content = openAi.Choices.FirstOrDefault()?.Message?.Content ?? "";

            content = CleanJsonString(content);

            var parsed = JsonSerializer.Deserialize<InterviewStartResponseDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new InterviewStartResponseDto();

            return parsed;
        }

         public async Task<InterviewEvaluationResultDto> EvaluateInterviewAsync(List<InterviewEvaluationRequestDto> responses)
        {
            var formattedAnswers = string.Join("\n", responses.Select(r => $"Spørgsmål: {r.Question}\nSvar: {r.Answer}\n"));
            var prompt = $$"""
            Du er en HR-ekspert. Evaluer hvert svar ud fra klarhed, relevans og professionalisme.
            Giv hver et svar en rating mellem 1-5 og kort feedback.
            Til sidst, skriv samlet vurdering.

            Returnér Kun i gyldig JSON i formatet:
            {
              "evaluations": [
                { "question": "...", "answer": "...", "rating": 1-5, "feedback": "..." }
              ],
              "overallFeedback": "...",
              "averageRating": (gennemsnit af ratings)
            }

            Svar:
            {{formattedAnswers}}
            """;

            var openAi = await CallOpenAiAsync(prompt);
            var content = openAi.Choices.FirstOrDefault()?.Message?.Content ?? "";
            content = CleanJsonString(content);

            var parsed = JsonSerializer.Deserialize<InterviewEvaluationResultDto>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                         ?? new InterviewEvaluationResultDto();

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


        public async Task<ApplicationResponseDto> GenerateApplicationAsync(string cv, string jobPosting)
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

        

        private ApplicationResponseDto ParseResponse(OpenAiResponse openAiResponse)
        {
            var content = openAiResponse.Choices.FirstOrDefault()?.Message?.Content;

            if (string.IsNullOrWhiteSpace(content))
                throw new InvalidOperationException("No content returned from OpenAI");

            content = CleanJsonString(content); 

            try
            {
                // Expect the model to return valid JSON
                var parsed = JsonSerializer.Deserialize<ApplicationResponseDto>(content, new JsonSerializerOptions
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
                return new ApplicationResponseDto
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
