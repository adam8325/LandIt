using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentValidation;
using Application.Services;
using Application.Interfaces.IAIService;
using Application.Interfaces.IFileProcessing;
using Application.DTOs.Interview;
using Application.DTOs.User;

namespace Application.Tests.Services
{
    public class InterviewServiceTest
    {
        [Fact]
        public async Task EvaluateInterview_ReturnsSummary_WhenAiServiceSucceeds()
        {
            // Arrange
            var mockAi = new Mock<IAIService>();
            var mockFileProc = new Mock<IFileProcessing>();

            var expected = new EvaluationSummaryDto
            {
                AverageRating = 4.5,
                OverallFeedback = "Good job",
                Evaluations = new List<EvaluationInterviewDto>
                {
                    new EvaluationInterviewDto { Question = "Q1", Answer = "A1", Rating = 5, Feedback = "Excellent" }
                }
            };

            mockAi
                .Setup(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()))
                .ReturnsAsync(expected);

            var svc = new InterviewService(mockAi.Object, mockFileProc.Object);

            // Use long strings to satisfy validators if they enforce minimum lengths
            var responses = new List<UserAnswerDto>
            {
                new UserAnswerDto { Question = new string('Q', 120), Answer = new string('A', 120) }
            };

            // Act
            var result = await svc.EvaluateInterviewAsync(responses);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expected.AverageRating, result.AverageRating);
            Assert.Equal(expected.OverallFeedback, result.OverallFeedback);
            Assert.Single(result.Evaluations);
            Assert.Equal("Q1", result.Evaluations[0].Question);
            Assert.Equal(5, result.Evaluations[0].Rating);

            mockAi.Verify(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()), Times.Once);
        }

        [Fact]
        public async Task EvaluateInterview_ThrowsValidationException_WhenInputInvalid()
        {
            // Arrange
            var mockAi = new Mock<IAIService>();
            var mockFileProc = new Mock<IFileProcessing>();
            var svc = new InterviewService(mockAi.Object, mockFileProc.Object);

            // Invalid response to trigger validator
            var invalidResponses = new List<UserAnswerDto>
            {
                new UserAnswerDto { Question = "", Answer = "" }
            };

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => svc.EvaluateInterviewAsync(invalidResponses));

            // Ensure AI service wasn't called due to validation failure
            mockAi.Verify(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()), Times.Never);
        }
    }
}