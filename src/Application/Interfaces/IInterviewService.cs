using Application.DTOs.Interview;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.IInterviewService
{
    public interface IInterviewService
    {
        Task<OverallInterviewDto> StartInterviewAsync(string? cvText, IFormFile? cvFile, string? jobText, IFormFile? jobFile);
        Task<OverallInterviewDto> EvaluateInterviewAsync(List<(string Question, string Answer)> responses);
    }
}
