using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using API.Controllers;
using Application.Interfaces.IApplicationService;
using Application.DTOs.User;
using Application.DTOs.ApplicationResponse;
using Moq;

namespace API.Tests.Controllers
{
    public class ApplicationControllerTests
    {
        [Fact]
        public async Task Generate_ReturnsOk_WithCorrectResponse()
        {
            // Arrange
            var expected = new GeneratedApplicationDto
            {
                ApplicationText = "Generated",
                EmailDraft = "Dear ...",
                MatchScore = 90
            };

            var mock = new Mock<IApplicationService>();
            mock.Setup(s => s.GenerateApplication(It.IsAny<UserDocumentDto>()))
                .ReturnsAsync(expected);

            var controller = new ApplicationController(mock.Object);

            // Act
            var result = await controller.Generate(new UserDocumentDto { CvText = "cv" });

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var dto = Assert.IsType<GeneratedApplicationDto>(okResult.Value);

            Assert.Equal(expected.ApplicationText, dto.ApplicationText);
            Assert.Equal(expected.EmailDraft, dto.EmailDraft);
            Assert.Equal(expected.MatchScore, dto.MatchScore);

            mock.Verify(s => s.GenerateApplication(It.IsAny<UserDocumentDto>()), Times.Once);
        }


        [Fact]
        public async Task Generate_ReturnsInternalServerError_WhenServiceThrows()
        {
            // Arrange
            var mockService = new Mock<IApplicationService>();

            mockService
                .Setup(s => s.GenerateApplication(It.IsAny<UserDocumentDto>()))
                .ThrowsAsync(new Exception("Test exception"));

            var controller = new ApplicationController(mockService.Object);

            var request = new UserDocumentDto
            {
                CvText = "cv",
                JobPostingText = "job posting"
            };

            // Act
            var result = await controller.Generate(request);

            // Assert
            var errorResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, errorResult.StatusCode);
            Assert.Equal("Error: Test exception", errorResult.Value);
        }


        // [Fact]
        // public async Task Generate_ReturnsBadRequest_WhenCVIsNullOrEmpty()
        // {
        //     // Arrange
        //     var fakeService = new FakeApplicationService();
        //     var controller = new ApplicationController(fakeService);
        //     var request = new UserDocumentDto
        //     {
        //         CvText = "",
        //         CvFile = null,
        //         JobPostingText = "We are seeking a software developer..."
        //     };

        //     // Act
        //     var actionResult = await controller.Generate(request);

        //     // Assert
        //     var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult);
        //     Assert.Equal("CV text or CV file must be provided.", badRequestResult.Value);
        // }
    }

        
}