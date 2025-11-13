using Application.DTOs.Interview;
using Application.DTOs.InterviewRequestDto;
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

        public async Task<InterviewStartResponseDto> StartInterviewAsync(InterviewStartRequestDto interviewRequestDto)
        {
            var cv = await GetTextAsync(interviewRequestDto.CvText, interviewRequestDto.CvFile);
            var job = await GetTextAsync(interviewRequestDto.JobPostingText, interviewRequestDto.JobPostingFile);

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
            {{cv}}

            Jobopslag:
            {{job}}
            """;

            var aiResponse = await _aiService.GenerateInterviewQuestionsAsync(prompt);

            return new InterviewStartResponseDto
            {
                Introduction = aiResponse.Introduction,
                Questions = aiResponse.Questions,
                ElevatorPitch = aiResponse.ElevatorPitch,
                SalaryEstimate = aiResponse.SalaryEstimate
            };
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

            var aiResponse = await _aiService.EvaluateInterviewAnswersAsync(prompt);

            return aiResponse;
        }
    }
}
