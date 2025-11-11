using System.Threading.Tasks;
using Application.DTOs.ApplicationResponse;
using Application.DTOs.Interview;

namespace Application.Interfaces.IAIService
{
    public interface IAIService
    {
        Task<ApplicationResponse> GenerateApplicationAsync(string cv, string jobPosting);
        Task<OverallInterviewDto> GenerateInterviewQuestionsAsync(string prompt);
        Task<OverallInterviewDto> EvaluateInterviewAsync(string prompt);
    }
}
