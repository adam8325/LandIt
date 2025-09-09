namespace Application.Interfaces
{
    public interface ISessionService
    {
        string CreateSession();
        void StoreCvAndJobPosting(string sessionId, string cv, string jobPosting, string analysis);
        SessionData? GetSessionData(string sessionId);
        void UpdateMotivation(string sessionId, string motivation, string experience);
        void DeleteSession(string sessionId);
    }

    public class SessionData
    {
        public string Cv { get; set; } = string.Empty;
        public string JobPosting { get; set; } = string.Empty;
        public string Analysis { get; set; } = string.Empty;
        public string Motivation { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}