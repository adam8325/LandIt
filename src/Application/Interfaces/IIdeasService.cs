namespace Application.Interfaces
{
    public interface IIdeasService
    {
        Task UpdateMotivationAsync(string sessionId, string motivation, string experience);
        Task<List<string>> GenerateIdeasAsync(string sessionId, string type);
    }
}