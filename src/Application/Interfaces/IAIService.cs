using System.Threading.Tasks;
using Application.DTOs.ApplicationResponse;
using Application.DTOs.Interview;

namespace Application.Interfaces.IAIService
{
    public interface IAIService
    {
        Task<ApplicationResponseDto> GenerateApplicationAsync(string cv, string jobPosting);
        Task<InterviewStartResponseDto> GenerateInterviewQuestionsAsync(string prompt);
        Task<InterviewEvaluationResultDto> EvaluateInterviewAnswersAsync(string prompt);
    }
}
