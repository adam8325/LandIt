using Application.DTOs.Interview;
using Application.DTOs.User;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces.IInterviewService
{
    public interface IInterviewService
    {
        Task<GeneratedInterviewDto> StartInterviewAsync(UserDocumentDto dto);
        Task<EvaluationSummaryDto> EvaluateInterviewAsync(List<UserAnswerDto> responses);
    }
}
