using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using API.Controllers;
using Application.Interfaces.IApplicationService;
using Application.DTOs.User;
using Application.DTOs.ApplicationResponse;

namespace API.Tests.Controllers
{
    public class ApplicationControllerTests
    {
        public class FakeApplicationService : IApplicationService
        {
            public Task<GeneratedApplicationDto> GenerateApplication(UserDocumentDto request)
            {
                var dto = new GeneratedApplicationDto
                {
                    ApplicationText = "Generated application text",
                    EmailDraft = "Dear Company, ...",
                    MatchScore = 92.5
                };
                return Task.FromResult(dto);
            }
        }

        [Fact]
        public async Task Generate_ReturnsOk_WithGeneratedApplicationDto()
        {
            // Arrange
            var fakeService = new FakeApplicationService();
            var controller = new ApplicationController(fakeService);
            var request = new UserDocumentDto
            {
                CvText = "Example CV text that is long enough...",
                JobPostingText = "Example job posting text that is long enough..."
            };

            // Act
            var actionResult = await controller.Generate(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            var value = Assert.IsType<GeneratedApplicationDto>(okResult.Value);

            Assert.Equal("Generated application text", value.ApplicationText);
            Assert.Equal("Dear Company, ...", value.EmailDraft);
            Assert.Equal(92.5, value.MatchScore);
        }
    }
}