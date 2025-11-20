using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentValidation;
using Application.DTOs.User;
using Application.DTOs.ApplicationResponse;
using Application.Interfaces.IFileProcessing;
using Application.Interfaces.IAIService;
using Application.Services.ApplicationService;

namespace Application.Tests.Services
{
    public class ApplicationServiceTest
    {
        [Fact]
        public async Task GenerateApplication_ReturnsGeneratedApplicationDto_WhenValid()
        {
            // Arrange
            var expected = new GeneratedApplicationDto
            {
                ApplicationText = "Generated application",
                EmailDraft = "Dear ...",
                MatchScore = 88.5
            };

            var mockFileProc = new Mock<IFileProcessing>();
            var mockAi = new Mock<IAIService>();
            mockAi.Setup(s => s.GenerateApplicationAsync(It.IsAny<UserDocumentDto>()))
                  .ReturnsAsync(expected);

            var svc = new ApplicationService(mockFileProc.Object, mockAi.Object);

            var dto = new UserDocumentDto
            {
                CvText = "osdjosidj osi djoijs dosd oisd josjd osdsd josmdos dosidj sdoisd josijdosd mosdj sodj soid jsodjiso djsodij sod. ojsd osjd osjdi osjid osjid osjd osdijosd jsodj dsosjd osdji sodj sodjs ojd soosjd ",
                JobPostingText = "sdoijs dosd osidj somdkosidj sdmosi jd osmdosidj osidj osdjisodjsod osjidosdij sodjsodj sdjdo sdjdsojs dosijd osjd osjd sojd dosjsjdojsd osdjosijd osdj osdji dosdij osdji sojd "
            };

            // Act
            var result = await svc.GenerateApplication(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.ApplicationText, result.ApplicationText);
            Assert.Equal(expected.EmailDraft, result.EmailDraft);
            Assert.Equal(expected.MatchScore, result.MatchScore);
            mockAi.Verify(x => x.GenerateApplicationAsync(It.IsAny<UserDocumentDto>()), Times.Once);
        }

        [Fact]
        public async Task GenerateApplication_ThrowsValidationException_WhenInvalidInput()
        {
            // Arrange
            var mockFileProc = new Mock<IFileProcessing>();
            var mockAi = new Mock<IAIService>();
            var svc = new ApplicationService(mockFileProc.Object, mockAi.Object);

        
            var invalidDto = new UserDocumentDto
            {
                CvText = "", // validator should mark invalid
                CvFile = null,
                JobPostingText = "Some job text"
            };

            // Act / Assert
            await Assert.ThrowsAsync<ValidationException>(async () => await svc.GenerateApplication(invalidDto));

            // Ensure AI service was not called
            mockAi.Verify(x => x.GenerateApplicationAsync(It.IsAny<UserDocumentDto>()), Times.Never);
        }
    }
}