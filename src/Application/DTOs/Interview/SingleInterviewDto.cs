namespace Application.DTOs.Interview
{
    public class SingleInterviewDto
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        // public int Rating { get; set; } // 1-5                //This needs to be added to the Evaluate endpoint
        // public string Feedback { get; set; } = string.Empty;  ////This needs to be added to the Evaluate endpoint
    }
}
