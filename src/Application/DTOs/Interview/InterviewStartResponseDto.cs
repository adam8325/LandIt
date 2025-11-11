namespace Application.DTOs.Interview;
public class InterviewStartResponseDto
{
    public string Introduction { get; set; } = "";
    public List<string> Questions { get; set; } = new List<string>();
    public string ElevatorPitch { get; set; } = "";
    public string SalaryEstimate { get; set; } = "";
}