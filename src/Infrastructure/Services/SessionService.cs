using Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services
{
    public class SessionService : ISessionService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly TimeSpan _sessionExpiry = TimeSpan.FromMinutes(30);

        public SessionService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public string CreateSession()
        {
            return $"sess_{Guid.NewGuid():N}";
        }

        public void StoreCvAndJobPosting(string sessionId, string cv, string jobPosting, string analysis)
        {
            var sessionData = new SessionData
            {
                Cv = cv,
                JobPosting = jobPosting,
                Analysis = analysis,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.Add(_sessionExpiry)
            };

            _memoryCache.Set(sessionId, sessionData, _sessionExpiry);
        }

        public SessionData? GetSessionData(string sessionId)
        {
            _memoryCache.TryGetValue(sessionId, out SessionData? sessionData);
            
            // Check if session has expired
            if (sessionData?.ExpiresAt < DateTime.UtcNow)
            {
                _memoryCache.Remove(sessionId);
                return null;
            }

            return sessionData;
        }

        public void UpdateMotivation(string sessionId, string motivation, string experience)
        {
            var sessionData = GetSessionData(sessionId);
            if (sessionData != null)
            {
                sessionData.Motivation = motivation;
                sessionData.Experience = experience;
                
                // Reset expiry time
                sessionData.ExpiresAt = DateTime.UtcNow.Add(_sessionExpiry);
                _memoryCache.Set(sessionId, sessionData, _sessionExpiry);
            }
        }

        public void DeleteSession(string sessionId)
        {
            _memoryCache.Remove(sessionId);
        }
    }
}