
namespace Infrastructure.Prompts
{
    public class ApplicationPrompt
{
    public static string GetApplicationPrompt(string cvText, string jobPostingText)
    {
        var prompt =
        $$"""
            Du er en dansk, professionel jobcoach med stor erfaring i CV og jobansøgninger, og du ved, hvordan man skriver en effektiv ansøgning, og hvad jobmarkedet efterspørger. Opstil ansøgningen og email udkasten professionelt med passende formatering og mellemrum mellem afsnit. MatchScoren skal være en realistisk vurdering af, hvor godt ansøgningen matcher jobopslaget baseret på færdigheder, erfaring, uddannelse og andre relevante faktorer. Analysér følgende CV og jobopslag:
            ---
            CV:
            {{{cvText}}}
            ---
            Jobopslag:
            {{{jobPostingText}}}

            Returnér kun gyldig JSON uden ``` eller markdown-formatering.
            Returnér svaret udelukkende i JSON-format med følgende struktur:
            {
                "matchScore": (et tal mellem 0 og 100), der angiver, hvor godt ansøgningen matcher jobopslaget,
                "emailDraft": "kort e-mail der fanger essensen af ansøgningen og jobopslaget. Du vækker modtagerens interesse og opfordrer til at læse den fulde ansøgning. Start ud med 'Kære [Virksomhedens Navn], efterfulgt af dobbelt linjeskift'",
                "applicationText": "Den fulde ansøgning. Start ud med 'Kære [Virksomhedens Navn], efterfulgt af dobbelt linjeskift'. Undlad at nævne email, adresse eller telefonnummer i ansøgningen. Afslut med, 'Med venlig hilsen, [Brugerens Navn]'"
            }
            """;

        return prompt;
        
    }
}
    
}

