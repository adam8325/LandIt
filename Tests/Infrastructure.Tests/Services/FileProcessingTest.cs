using Infrastructure.Services;
using System.Text;
using Microsoft.AspNetCore.Http.Internal;

namespace Infrastructure.Tests.Services
{
    public class FileProcessingTest
    {
        [Fact]
        public async Task GetTextAsync_ReturnsText_WhenTextProvided()
        {
            var svc = new FileProcessing();
            var result = await svc.GetTextAsync("hello", null);
            Assert.Equal("hello", result);
        }

        [Fact]
        public async Task GetTextAsync_Throws_WhenNoTextAndNoFile()
        {
            var svc = new FileProcessing();
            await Assert.ThrowsAsync<System.ArgumentException>(() => svc.GetTextAsync(null, null));
        }

        [Fact]
        public async Task ExtractTextAsync_ThrowsForUnsupportedExtension()
        {
            var svc = new FileProcessing();

            var bytes = Encoding.UTF8.GetBytes("plain text");
            using var ms = new MemoryStream(bytes);
            var file = new FormFile(ms, 0, ms.Length, "file", "test.txt");

            await Assert.ThrowsAsync<System.ArgumentException>(() => svc.ExtractTextAsync(file));
        }

        [Fact]
        public async Task ExtractTextAsync_ThrowsOnNullFile()
        {
            var svc = new FileProcessing();
            await Assert.ThrowsAsync<System.ArgumentNullException>(() => svc.ExtractTextAsync(null));
        }
    }
}
