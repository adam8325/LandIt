namespace Application.DTOs.ApplicationResponse
{
    public class ApplicationResponseDto
    {
        public string ApplicationText { get; set; } = "";
        public string EmailDraft { get; set; } = "";
        public double MatchScore { get; set; }
    }
}
