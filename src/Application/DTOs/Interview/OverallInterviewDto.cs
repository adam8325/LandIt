namespace Application.DTOs.Interview
{
    public class OverallInterviewDto
    {
        public string CandidateName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public List<SingleInterviewDto> Responses { get; set; } = new();
        public string OverallFeedback { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }
}
