public interface ICvAndJobPostService
{
    Task<string> AnalyzeCvAndJobPostingAsync(string cvContent, string jobPostingContent);
}