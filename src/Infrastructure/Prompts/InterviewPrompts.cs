
using Application.DTOs.Interview;

namespace Infrastructure.Prompts
{
    public class InterviewPrompts
    {
        public static string GetInterviewStartPrompt( string cvText, string jobPostingText)
        {
            var prompt =
            $$"""
                Du er en HR-rekrutteringskonsulent specialist for virksomheden, der nævnes i jobopslaget. 
                Analysér følgende CV og jobopslag, og generér 5-7 relevante interviewspørgsmål.
                Spørgsmålene skal være realistiske og målrettet stillingen. Spørgsmålene skal være detaljerede og udfordrende, så de tester kandidatens færdigheder og erfaringer i forhold til jobopslaget. Hav fokus på både tekniske, såvel som bløde færdigheder og ligeledes virksomhedens kultur. Tag KUN udgangspunkt i både CV og jobopslag for at skabe relevante spørgsmål. Alle spørgsmål skal være faktuelle og baseret på inputkilderne. Ingen gætværk, ingen antagelser. 

                Ud fra CV og jobopslag, skal du også generere en skarp elevator pitch, der taler ind til de vigtigste kvalifikationer og erfaringer i CV'et, som matcher jobopslaget. Her skal du udtrække kandidatens navn direkte fra CV'et - ingen placeholders. Finder du ikke et navn, så undlad at start med navnet. Opstil pitchen professionelt med passende afsnit og mellemrum imellem afsnit. Gør den fængende og overbevisende for en HR-medarbejder, og giv den gerne noget personlighed. Den skal skrives i 1. person og ikke i 3. person.

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

            return prompt;
        }

        public static string GetInterviewEvaluationPrompt(List<UserAnswerDto> responses)
        {
            var formattedAnswers = string.Join("\n", responses.Select(r => $"Spørgsmål: {r.Question}\nSvar: {r.Answer}\n"));
            var prompt = $$"""
            Du er en HR-ekspert. Evaluer hvert svar ud fra klarhed, relevans og professionalisme.
            Giv hver et svar en rating mellem 1-5 og kort feedback. Feedback på hvert svar skal være kort og præcist, og fokusere på både styrker og forbedringsområder.
            Til sidst, skriv samlet vurdering.

            Returnér KUN i gyldig JSON i formatet:
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

            return prompt;
        }
    }
}