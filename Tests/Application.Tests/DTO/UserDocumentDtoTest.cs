using Application.DTOs.User;
using Xunit;

namespace Application.Tests.DTO
{
    public class UserDocumentDtoTests
    {
        private readonly UserDocumentDtoValidator _validator = new();

        [Fact]
        public void Should_Pass_When_CvTextAndJobPostingTextAreProvided()
        {
            // Arrange
            var dto = new UserDocumentDto
            {
                CvText = new string('x', 100),          
                JobPostingText = new string('x', 100)   
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            Assert.True(result.IsValid);
        }

        [Fact]
        public void Should_Fail_When_CvTextAndFileAreEmpty_And_JobPostingTextAndFileAreEmpty()
        {
            // Arrange
            var dto = new UserDocumentDto(); // Ingen CV og ingen jobopslag

            // Act
            var result = _validator.Validate(dto);

            // Assert
            Assert.False(result.IsValid);

            // Tjek, at begge fejlmeddelelser er med
            Assert.Contains(result.Errors, e => e.ErrorMessage == "Enten CV-tekst eller CV-fil skal angives.");
            Assert.Contains(result.Errors, e => e.ErrorMessage == "Enten jobopslagstekst eller jobopslagsfil skal angives.");
        }
    }
}
