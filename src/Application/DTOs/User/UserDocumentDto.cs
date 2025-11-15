using Microsoft.AspNetCore.Http;

namespace Application.DTOs.User
{
    public class UserDocumentDto
    {
        public string? CvText { get; set; }
        public IFormFile? CvFile { get; set; }
        public string? JobPostingText { get; set; }
        public IFormFile? JobPostingFile { get; set; }
    }
}