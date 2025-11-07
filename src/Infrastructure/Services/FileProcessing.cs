using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Application.Interfaces.IFileProcessing;

namespace Infrastructure.Services
{
    public class FileProcessing : IFileProcessing
    {
        private static readonly string[] SupportedTypes = { ".pdf", ".docx" };

        public async Task<string> ExtractTextAsync(IFormFile file)
        {
            if (file == null)
                throw new ArgumentNullException(nameof(file));

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!SupportedTypes.Contains(extension))
                throw new ArgumentException($"Unsupported file type: {extension}");

            using var stream = file.OpenReadStream();
            return extension switch
            {
                ".pdf" => await ExtractTextFromPdfAsync(stream),
                ".docx" => await ExtractTextFromDocxAsync(stream),
                _ => throw new NotSupportedException($"File type not supported: {extension}")
            };
        }

        private async Task<string> ExtractTextFromPdfAsync(Stream stream)
        {
            using var reader = new PdfReader(stream);
            using var pdf = new PdfDocument(reader);
            var text = new StringBuilder();

            for (int i = 1; i <= pdf.GetNumberOfPages(); i++)
            {
                var pageText = PdfTextExtractor.GetTextFromPage(pdf.GetPage(i));
                text.AppendLine(pageText);
            }

            return await Task.FromResult(text.ToString());
        }

        private async Task<string> ExtractTextFromDocxAsync(Stream stream)
        {
            using var doc = WordprocessingDocument.Open(stream, false);
            var body = doc.MainDocumentPart?.Document.Body;
            if (body == null)
                return string.Empty;

            var text = new StringBuilder();
            foreach (var paragraph in body.Elements<Paragraph>())
                text.AppendLine(paragraph.InnerText);

            return await Task.FromResult(text.ToString());
        }
    }
}