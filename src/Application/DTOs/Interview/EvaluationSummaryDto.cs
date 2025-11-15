namespace Application.DTOs.Interview
{
    public class EvaluationSummaryDto
    {
        public List<EvaluationInterviewDto> Evaluations { get; set; } = new();
        public string OverallFeedback { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }
}
