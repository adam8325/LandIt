using Application.DTOs.Interview;
using Application.DTOs.InterviewRequestDto;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.IInterviewService
{
    public interface IInterviewService
    {
        Task<InterviewStartResponseDto> StartInterviewAsync(InterviewStartRequestDto interviewRequestDto);
        Task<InterviewEvaluationResultDto> EvaluateInterviewAsync(List<InterviewEvaluationRequestDto> responses);
    }
}
