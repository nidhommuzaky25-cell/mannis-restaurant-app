using Microsoft.AspNetCore.Mvc;
using be.DTOs;
using be.Services;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var (isSuccess, token, username, errorMessage) = await _authService.LoginAsync(dto.Username, dto.Password);

            if (!isSuccess)
            {
                if (errorMessage == "Username dan password wajib diisi.")
                {
                    return BadRequest(new { message = errorMessage });
                }
                return Unauthorized(new { message = errorMessage });
            }

            return Ok(new
            {
                message = "Login berhasil!",
                token = token,
                username = username
            });
        }
    }
}