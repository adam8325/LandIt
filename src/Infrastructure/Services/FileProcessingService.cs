using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Text;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Infrastructure.Services
{
    public class FileProcessingService : IFileProcessingService
    {
        private readonly string[] _supportedTypes = { ".pdf", ".doc", ".docx" };

        public bool IsSupportedFileType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return _supportedTypes.Contains(extension);
        }

        public async Task<string> ExtractTextFromFileAsync(IFormFile file)
        {
            if (!IsSupportedFileType(file.FileName))
            {
                throw new ArgumentException("Unsupported file type");
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            using var stream = file.OpenReadStream();
            
            return extension switch
            {
                ".pdf" => await ExtractTextFromPdfAsync(stream),
                ".docx" => await ExtractTextFromDocxAsync(stream),
                ".doc" => throw new NotSupportedException("DOC files are not yet supported. Please use DOCX or PDF."),
                _ => throw new ArgumentException("Unsupported file type")
            };
        }

        private async Task<string> ExtractTextFromPdfAsync(Stream stream)
        {
            try
            {
                using var pdfReader = new PdfReader(stream);
                using var pdfDoc = new PdfDocument(pdfReader);
                
                var text = new StringBuilder();
                for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
                {
                    var page = pdfDoc.GetPage(i);
                    var pageText = PdfTextExtractor.GetTextFromPage(page);
                    text.AppendLine(pageText);
                }
                
                return text.ToString();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error extracting text from PDF: {ex.Message}");
            }
        }

        private async Task<string> ExtractTextFromDocxAsync(Stream stream)
        {
            try
            {
                using var doc = WordprocessingDocument.Open(stream, false);
                var body = doc.MainDocumentPart?.Document.Body;
                
                if (body == null)
                    return string.Empty;
                
                var text = new StringBuilder();
                foreach (var paragraph in body.Elements<Paragraph>())
                {
                    text.AppendLine(paragraph.InnerText);
                }
                
                return text.ToString();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error extracting text from DOCX: {ex.Message}");
            }
        }
    }
}