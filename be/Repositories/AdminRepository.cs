using Microsoft.EntityFrameworkCore;
using be.Data;
using be.Models;

namespace be.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly AppDbContext _context;

        public AdminRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Admin?> GetAdminByUsernameAsync(string username)
        {
            return await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == username);
        }
    }
}
