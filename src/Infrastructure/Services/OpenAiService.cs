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

        public async Task<List<string>> GenerateIdeasAsync(string cv, string jobPosting, string type)
        {
            string prompt;
            if (type == "motivation")
            {
                prompt = $@"Giv tre korte, konkrete forslag til motivation og match til en ansøgning. Brug følgende CV og jobopslag som kontekst. Fjern alle symboler der ikke er nødvendige. Indholdet skal følge denne konvention. Brug den gerne som eksempel.

                ###
                - Jeg er motiveret af at arbejde med cutting-edge teknologi, der virkelig kan ændre brugeroplevelsen.  

                - At kunne bidrage til et team, hvor mine idéer forventes og værdsættes, inspirerer mig meget.  

                - Muligheden for at udvikle AI-drevne løsninger, der skaber reel værdi for kunderne, fascinerer mig.
                ###

                CV:
                {cv}

                Jobopslag:
                {jobPosting}

                Svar som en JSON-liste med tre citater.";
            }
            else // "experience"
            {
                prompt = $@"Giv tre korte, konkrete forslag til erfaringer og styrker, der kan bruges i en ansøgning. Brug følgende CV og jobopslag som kontekst.  Fjern alle symboler der ikke er nødvendige. Indholdet skal følge denne konvention. Brug den gerne som eksempel.

                ###
                - Min erfaring med .NET og React.js fra praktikforløbet vil styrke udviklingen af AI-drevne løsninger, der kræver moderne frontend og backend integration i jeres projekter.

                - Jeg har udviklet Python-biblioteker og automatiseringsscripts, hvilket vil bidrage til effektiv datahåndtering og intelligent procesoptimering i jeres AI-implementeringer.

                - Min viden om SCRUM og agile metoder sikrer, at jeg kan arbejde effektivt i teams og tilpasse mig hurtigt til skiftende krav i jeres innovative udviklingsmiljø.
                ###

                CV:
                {cv}

                Jobopslag:
                {jobPosting}

                Svar som en JSON-liste med tre citater.";
            }

            var aiResponse = await CallOpenAiAsync(prompt);

            // Fjern markdown og alt udenom selve JSON-listen
            var cleaned = aiResponse
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();

            // Prøv at finde første og sidste kantede parentes (array)
            int start = cleaned.IndexOf('[');
            int end = cleaned.LastIndexOf(']');
            if (start != -1 && end != -1 && end > start)
            {
                cleaned = cleaned.Substring(start, end - start + 1);
            }

            try
            {
                var ideas = JsonSerializer.Deserialize<List<string>>(cleaned);
                if (ideas != null)
                    return ideas;
            }
            catch { }
            // Hvis alt fejler, returnér hele svaret som én idé
            return new List<string> { aiResponse };
        }

        public Task<string> GenerateApplicationAsync(string cv, string jobPosting, string motivation, string style)
            => throw new NotImplementedException();
    }
}
