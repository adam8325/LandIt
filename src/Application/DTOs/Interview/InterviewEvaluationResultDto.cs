namespace Application.DTOs.Interview
{
    public class InterviewEvaluationResultDto
    {
        public string CandidateName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public List<InterviewEvaluationDto> Responses { get; set; } = new();
        public string OverallFeedback { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }
}
