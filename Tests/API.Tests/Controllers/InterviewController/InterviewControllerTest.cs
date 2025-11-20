using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using WebAPI.Controllers;
using Application.Interfaces.IInterviewService;
using Application.DTOs.Interview;
using Application.DTOs.User;

namespace API.Tests.Controllers
{
    public class InterviewControllerTests
    {
        private readonly Mock<IInterviewService> _mockService;
        private readonly InterviewController _controller;

        public InterviewControllerTests()
        {
            _mockService = new Mock<IInterviewService>();
            _controller = new InterviewController(_mockService.Object);
        }

        #region StartInterview Tests

        [Fact]
        public async Task StartInterview_ReturnsOk_WhenServiceSucceeds()
        {
            // Arrange
            var expectedResult = new GeneratedInterviewDto
            {
                Introduction = "Hello!",
                Questions = new List<string> { "Q1?", "Q2?" },
                ElevatorPitch = "I am a developer",
                SalaryEstimate = "$60k"
            };

            _mockService.Setup(s => s.StartInterviewAsync(It.IsAny<UserDocumentDto>()))
                        .ReturnsAsync(expectedResult);

            var request = new UserDocumentDto { CvText = "cv", JobPostingText = "job" };

            // Act
            var result = await _controller.StartInterview(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<GeneratedInterviewDto>(okResult.Value);

            Assert.Equal("Hello!", value.Introduction);
            Assert.Equal(2, value.Questions.Count);
            Assert.Equal("I am a developer", value.ElevatorPitch);
            Assert.Equal("$60k", value.SalaryEstimate);

            _mockService.Verify(s => s.StartInterviewAsync(It.IsAny<UserDocumentDto>()), Times.Once);
        }

        [Fact]
        public async Task StartInterview_Returns500_WhenServiceThrows()
        {
            _mockService.Setup(s => s.StartInterviewAsync(It.IsAny<UserDocumentDto>()))
                        .ThrowsAsync(new Exception("Service failure"));

            var request = new UserDocumentDto { CvText = "cv", JobPostingText = "job" };

            var result = await _controller.StartInterview(request);

            var errorResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, errorResult.StatusCode);
            Assert.Equal("Error: Service failure", errorResult.Value);
        }

        #endregion

        #region TranscribeInterviewAnswer Tests

        [Fact]
        public async Task TranscribeInterviewAnswer_ReturnsOk_WhenServiceSucceeds()
        {
            _mockService.Setup(s => s.TranscribeAnswerAsync(It.IsAny<IFormFile>()))
                        .ReturnsAsync("Transcribed text");

            var fakeFile = new FormFile(new MemoryStream(), 0, 0, "audio", "file.wav");

            var result = await _controller.TranscribeInterviewAnswer(fakeFile);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<TranscriptionDto>(okResult.Value);

            Assert.Equal("Transcribed text", value.Text);
        }


        [Fact]
        public async Task TranscribeInterviewAnswer_Returns500_WhenServiceThrows()
        {
            _mockService.Setup(s => s.TranscribeAnswerAsync(It.IsAny<IFormFile>()))
                        .ThrowsAsync(new Exception("Service failure"));

            var fakeFile = new FormFile(new MemoryStream(), 0, 0, "audio", "file.wav");

            var result = await _controller.TranscribeInterviewAnswer(fakeFile);

            var errorResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, errorResult.StatusCode);
            Assert.Equal("Error: Service failure", errorResult.Value);
        }

        #endregion

        #region EvaluateInterview Tests

        [Fact]
        public async Task EvaluateInterview_ReturnsOk_WhenServiceSucceeds()
        {
            var expectedResult = new EvaluationSummaryDto
            {
                AverageRating = 4.5,
                OverallFeedback = "Good job",
                Evaluations = new List<EvaluationInterviewDto>
                {
                    new EvaluationInterviewDto { Question = "Q1", Answer = "A1", Rating = 5, Feedback = "Excellent" },
                    new EvaluationInterviewDto { Question = "Q2", Answer = "A2", Rating = 4, Feedback = "Good" }
                }
            };

            _mockService.Setup(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()))
                        .ReturnsAsync(expectedResult);

            var responses = new List<UserAnswerDto>
            {
                new UserAnswerDto { Question = "Q1", Answer = "A1" },
                new UserAnswerDto { Question = "Q2", Answer = "A2" }
            };

            var result = await _controller.EvaluateInterview(responses);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsType<EvaluationSummaryDto>(okResult.Value);

            Assert.Equal(4.5, value.AverageRating);
            Assert.Equal("Good job", value.OverallFeedback);
            Assert.Equal(2, value.Evaluations.Count);
            Assert.Equal("Q1", value.Evaluations[0].Question);
            Assert.Equal(5, value.Evaluations[0].Rating);

            _mockService.Verify(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()), Times.Once);
        }

        [Fact]
        public async Task EvaluateInterview_Returns500_WhenServiceThrows()
        {
            _mockService.Setup(s => s.EvaluateInterviewAsync(It.IsAny<List<UserAnswerDto>>()))
                        .ThrowsAsync(new Exception("Service failure"));

            var responses = new List<UserAnswerDto>
            {
                new UserAnswerDto { Question = "Q1", Answer = "A1" }
            };

            var result = await _controller.EvaluateInterview(responses);

            var errorResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, errorResult.StatusCode);
            Assert.Equal("Error: Service failure", errorResult.Value);
        }

        #endregion
    }
}
