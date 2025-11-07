using System.Threading.Tasks;
using Application.DTOs.ApplicationRequest;
using Application.DTOs.ApplicationResponse;

namespace Application.Interfaces.IApplicationService
{
    public interface IApplicationService
    {
        Task<ApplicationResponse> ExecuteAsync(ApplicationRequest request);
    }
}
