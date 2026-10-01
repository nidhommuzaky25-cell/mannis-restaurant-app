using Microsoft.AspNetCore.Mvc;
using be.Services;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // GET /api/dashboard/stats
        [HttpGet]
        [Route("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }

        // GET /api/dashboard/chart?year=2026&month=7&view=weekly
        // view = "weekly" → per minggu dalam bulan tsb
        // view = "monthly" → per bulan dalam tahun tsb
        [HttpGet]
        [Route("chart")]
        public async Task<IActionResult> GetChartData([FromQuery] int year, [FromQuery] int? month, [FromQuery] string view = "weekly")
        {
            try
            {
                var chartData = await _dashboardService.GetChartDataAsync(year, month, view);
                return Ok(chartData);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }

        // GET /api/dashboard/available-months — daftar bulan yang punya data
        [HttpGet]
        [Route("available-months")]
        public async Task<IActionResult> GetAvailableMonths()
        {
            try
            {
                var availableMonths = await _dashboardService.GetAvailableMonthsAsync();
                return Ok(availableMonths);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }
    }
}
