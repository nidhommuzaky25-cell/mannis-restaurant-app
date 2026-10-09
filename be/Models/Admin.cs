using System.ComponentModel.DataAnnotations.Schema;

namespace be.Models
{
    public class Admin
    {
        public int AdminId { get; set; }
        public string Username { get; set; } = string.Empty;
        
        [Column("Password")]  // Map ke kolom "Password" di database
        public string PasswordHash { get; set; } = string.Empty;
    }
}