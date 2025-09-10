namespace Application.Interfaces
{
    public interface IOpenAiService
    {
        Task<string> AnalyzeCvAndJobPostingAsync(string cv, string jobPosting);
        Task<List<string>> GenerateIdeasAsync(string cv, string jobPosting, string type);
        Task<string> GenerateApplicationAsync(string cv, string jobPosting, string motivation, string style);
    }
}
