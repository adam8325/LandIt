namespace Application.Interfaces
{
    public interface IOpenAiService
    {
        Task<string> AnalyzeCvAndJobPostingAsync(string cv, string jobPosting);
        Task<List<string>> GenerateMotivationIdeasAsync(string cv, string jobPosting);
        Task<string> GenerateApplicationAsync(string cv, string jobPosting, string motivation, string style);
    }
}
