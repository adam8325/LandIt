using System.Threading.Tasks;
using Application.DTOs.ApplicationResponse;
using Application.DTOs.Interview;
using Application.DTOs.User;

namespace Application.Interfaces.IAIService
{
    public interface IAIService
    {
        Task<ApplicationResponseDto> GenerateApplicationAsync(UserDocumentDto dto);
        Task<GeneratedInterviewDto> GenerateInterviewAsync(UserDocumentDto dto);
        Task<EvaluationSummaryDto> EvaluateInterviewAsync(List<UserAnswerDto> responses);
    }
}
