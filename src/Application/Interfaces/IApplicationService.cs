using System.Threading.Tasks;
using Application.DTOs.ApplicationResponse;
using Application.DTOs.User;

namespace Application.Interfaces.IApplicationService
{
    public interface IApplicationService
    {
        Task<GeneratedApplicationDto> GenerateApplication(UserDocumentDto request);
    }
}
