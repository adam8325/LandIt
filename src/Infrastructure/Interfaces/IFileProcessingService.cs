using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IFileProcessingService
    {
        Task<string> ExtractTextFromFileAsync(IFormFile file);
        bool IsSupportedFileType(string fileName);
    }
}