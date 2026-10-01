using be.Models;

namespace be.Repositories
{
    public interface IAdminRepository
    {
        Task<Admin?> GetAdminByUsernameAsync(string username);
    }
}
