using be.Repositories;

namespace be.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAdminRepository _adminRepository;

        public AuthService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<(bool IsSuccess, string? Username, string? ErrorMessage)> LoginAsync(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return (false, null, "Username dan password wajib diisi.");
            }

            var admin = await _adminRepository.GetAdminByUsernameAsync(username);

            if (admin == null || admin.PasswordHash != password)
            {
                return (false, null, "Username atau password salah!");
            }

            return (true, admin.Username, null);
        }
    }
}
