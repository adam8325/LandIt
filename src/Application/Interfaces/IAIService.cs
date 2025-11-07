using System.Threading.Tasks;
using Application.DTOs.ApplicationResponse;

namespace Application.Interfaces.IAIService
{
    public interface IAIService
    {
        Task<ApplicationResponse> GenerateApplicationAsync(string cv, string jobPosting);
    }
}
