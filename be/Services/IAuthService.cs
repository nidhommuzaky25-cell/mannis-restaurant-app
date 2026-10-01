namespace be.Services
{
    public interface IAuthService
    {
        Task<(bool IsSuccess, string? Username, string? ErrorMessage)> LoginAsync(string username, string password);
    }
}
