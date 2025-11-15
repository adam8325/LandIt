namespace Application.DTOs.Interview
{
    public class EvaluationInterviewDto
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int Rating { get; set; } = 0;
        public string Feedback { get; set; } = string.Empty;
    }
}
