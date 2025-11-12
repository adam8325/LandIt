namespace Application.DTOs.Interview
{
    public class InterviewEvaluationResultDto
    {
        public List<InterviewEvaluationDto> Evaluations { get; set; } = new();
        public string OverallFeedback { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }
}
