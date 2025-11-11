using Application.DTOs.Interview;
using Application.Interfaces.IAIService;
using Application.Interfaces.IFileProcessing;
using Application.Interfaces.IInterviewService;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class InterviewService : IInterviewService
    {
        private readonly IAIService _aiService;
        private readonly IFileProcessing _fileProcessing;

        public InterviewService(IAIService aiService, IFileProcessing fileProcessing)
        {
            _aiService = aiService;
            _fileProcessing = fileProcessing;
        }

        private async Task<string> GetTextAsync(string? text, IFormFile? file)
        {
            if (!string.IsNullOrWhiteSpace(text))
                return text;

            if (file != null)
                return await _fileProcessing.ExtractTextAsync(file);

            throw new ArgumentException("Either text or file input must be provided.");
        }

        public async Task<OverallInterviewDto> StartInterviewAsync(string? cvText, IFormFile? cvFile, string? jobText, IFormFile? jobFile)
        {
            var cv = await GetTextAsync(cvText, cvFile);
            var job = await GetTextAsync(jobText, jobFile);

            // Bruger eksisterende OpenAiService
            var prompt = $$"""
            Du er en professionel HR-rekrutteringskonsulent. 
            Analysér følgende CV og jobopslag, og generér 5-8 relevante interviewspørgsmål.
            Spørgsmålene skal være på dansk, realistiske og målrettet stillingen.

            Returnér JSON i dette format:
            {
              "introduction": "kort introduktion som HR-bot ville sige",
              "questions": ["Spørgsmål 1...", "Spørgsmål 2...", ...]
            }

            CV:
            {{cv}}

            Jobopslag:
            {{job}}
            """;

            var aiResponse = await _aiService.GenerateInterviewQuestionsAsync(prompt);

            return new OverallInterviewDto
            {
                CandidateName = "Bruger", // evt. udledt fra CV senere
                Position = "Ukendt stilling",
                OverallFeedback = aiResponse.OverallFeedback,
                Responses = aiResponse.Responses
                    .Select(q => new SingleInterviewDto { Question = q.Question })
                    .ToList()
            };
        }

        public async Task<OverallInterviewDto> EvaluateInterviewAsync(List<(string Question, string Answer)> responses)
        {
            var formattedAnswers = string.Join("\n", responses.Select(r => $"Spørgsmål: {r.Question}\nSvar: {r.Answer}\n"));

            var prompt = $$"""
            Du er en HR-ekspert. Evaluer hvert svar ud fra klarhed, relevans og professionalisme.
            Giv hver et svar en rating mellem 1-5 og kort feedback.
            Til sidst, skriv samlet vurdering.

            Returnér JSON i formatet:
            {
              "evaluations": [
                { "question": "...", "answer": "...", "rating": 1-5, "feedback": "..." }
              ],
              "overallFeedback": "..."
            }

            Svar:
            {{formattedAnswers}}
            """;

            var aiResponse = await _aiService.EvaluateInterviewAsync(prompt);

            return aiResponse;
        }
    }
}
