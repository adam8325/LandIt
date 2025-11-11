using Application.DTOs.Interview;
using Application.DTOs.InterviewRequestDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.IInterviewService
{
    public interface IInterviewService
    {
        Task<InterviewOutputDto> StartInterviewAsync(InterviewRequestDto interviewRequestDto);
        Task<OverallInterviewDto> EvaluateInterviewAsync(List<(string Question, string Answer)> responses);
    }
}
