using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Interfaces.IFileProcessing
{
    public interface IFileProcessing
    {
        Task<string> ExtractTextAsync(IFormFile? file);
        Task<string> GetTextAsync(string? text, IFormFile? file);
    }
}
