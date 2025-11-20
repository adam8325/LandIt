using System.Net;
using System.Text;
using Microsoft.Extensions.Configuration;
using Application.DTOs.Interview;
using Application.DTOs.User;
using Infrastructure.Services;
using System.Text.Json;

namespace Infrastructure.Tests.Services
{
    internal class FakeHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, HttpResponseMessage> _responder;

        public FakeHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder)
        {
            _responder = responder ?? throw new ArgumentNullException(nameof(responder));
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return Task.FromResult(_responder(request));
        }
    }

    public class AIServiceTest
    {
        private IConfiguration GetConfiguration() =>
            new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
            {
                ["OpenAI:ApiKey"] = "test-key"
            }).Build();

        [Fact]
        public async Task GenerateApplicationAsync_ParsesJsonResponse()
        {
            // Arrange
            var innerJson = new { applicationText = "Generated app", emailDraft = "Dear X", matchScore = 90 };
            var wrapperObj = new { choices = new[] { new { message = new { content = JsonSerializer.Serialize(innerJson) } } } };
            var wrapper = JsonSerializer.Serialize(wrapperObj);
            var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(wrapper, Encoding.UTF8, "application/json")
            });
            var http = new HttpClient(handler);
            var svc = new OpenAiService(http, GetConfiguration());

            var dto = new UserDocumentDto { CvText = new string('C', 120), JobPostingText = new string('J', 120) };

            // Act
            var result = await svc.GenerateApplicationAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Generated app", result.ApplicationText);
            Assert.Equal("Dear X", result.EmailDraft);
            Assert.Equal(90, result.MatchScore);
        }

        [Fact]
        public async Task GenerateInterviewAsync_HandlesFencedJson()
        {
            // Arrange
            var innerJson = "{\"introduction\":\"Hi\",\"questions\":[\"Q1\",\"Q2\"],\"elevatorPitch\":\"Pitch\",\"salaryEstimate\":\"50k\"}";
            
            var fenced = $"```json\n{innerJson}\n```";
            var wrapperObj = new { choices = new[] { new { message = new { content = fenced } } } };
            var wrapper = JsonSerializer.Serialize(wrapperObj);

            var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(wrapper, Encoding.UTF8, "application/json")
            });
            var http = new HttpClient(handler);
            var svc = new OpenAiService(http, GetConfiguration());

            var dto = new UserDocumentDto { CvText = new string('C', 120), JobPostingText = new string('J', 120) };

            // Act
            var res = await svc.GenerateInterviewAsync(dto);

            // Assert
            Assert.NotNull(res);
            Assert.Equal("Hi", res.Introduction);
            Assert.Equal(2, res.Questions?.Count);
            Assert.Equal("Pitch", res.ElevatorPitch);
            Assert.Equal("50k", res.SalaryEstimate);
        }

        [Fact]
        public async Task EvaluateInterviewAsync_ParsesEvaluations()
        {
            // Arrange
            var evalJson = @"{
              ""evaluations"": [
                { ""question"": ""Q1"", ""answer"": ""A1"", ""rating"": 5, ""feedback"": ""Great"" }
              ],
              ""overallFeedback"": ""Well done"",
              ""averageRating"": 5.0
            }";
            var wrapperObj = new { choices = new[] { new { message = new { content = evalJson } } } };
            var wrapper = JsonSerializer.Serialize(wrapperObj);

            var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(wrapper, Encoding.UTF8, "application/json")
            });
            var http = new HttpClient(handler);
            var svc = new OpenAiService(http, GetConfiguration());

            var responses = new List<UserAnswerDto>
            {
                new UserAnswerDto { Question = new string('Q', 120), Answer = new string('A', 120) }
            };

            // Act
            var summary = await svc.EvaluateInterviewAsync(responses);

            // Assert
            Assert.NotNull(summary);
            Assert.Equal("Well done", summary.OverallFeedback);
            Assert.Equal(5.0, summary.AverageRating);
            Assert.Single(summary.Evaluations);
            Assert.Equal("Q1", summary.Evaluations[0].Question);
            Assert.Equal(5, summary.Evaluations[0].Rating);
            Assert.Equal("Great", summary.Evaluations[0].Feedback);
        }

        [Fact]
        public async Task TranscribeAudioAsync_ReturnsTextProperty()
        {
            // Arrange
            var json = "{\"text\":\"transcribed audio text\"}";
            var handler = new FakeHttpMessageHandler(req => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            });
            var http = new HttpClient(handler);
            var svc = new OpenAiService(http, GetConfiguration());

            using var ms = new MemoryStream(Encoding.UTF8.GetBytes("dummy"));

            // Act
            var text = await svc.TranscribeAudioAsync(ms);

            // Assert
            Assert.Equal("transcribed audio text", text);
        }
    }
}