using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using be.Data;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/dashboard/stats
        [HttpGet]
        [Route("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var ordersLunas = _context.Orders.Where(o => o.PaymentStatus == "Lunas");
                decimal totalRevenue = await ordersLunas.AnyAsync() ? await ordersLunas.SumAsync(o => o.TotalAmount) : 0;

                var totalOrders = await _context.Orders.CountAsync();

                var totalItems = _context.OrderDetails;
                int productSold = await totalItems.AnyAsync() ? await totalItems.SumAsync(od => od.Quantity) : 0;

                var recentOrders = await _context.Orders
                    .OrderByDescending(o => o.OrderDate)
                    .Take(5)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.TableNumber,
                        o.TotalAmount,
                        Status = o.PaymentStatus,
                        o.OrderDate
                    })
                    .ToListAsync();

                // Chart default: 7 hari terakhir (per hari)
                var sevenDaysAgo = DateTime.Today.AddDays(-6);
                var chartQuery = await _context.Orders
                    .Where(o => o.PaymentStatus == "Lunas" && o.OrderDate.Date >= sevenDaysAgo)
                    .ToListAsync();

                var revenueChart = chartQuery
                    .GroupBy(o => o.OrderDate.Date)
                    .Select(g => new
                    {
                        Date = g.Key.ToString("yyyy-MM-dd"),
                        Revenue = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(g => g.Date)
                    .ToList();

                return Ok(new
                {
                    TotalRevenue = totalRevenue,
                    TotalOrders = totalOrders,
                    ProductSold = productSold,
                    RecentOrders = recentOrders,
                    RevenueChart = revenueChart
                });
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
                var allOrders = await _context.Orders
                    .Where(o => o.PaymentStatus == "Lunas")
                    .ToListAsync();

                if (view == "monthly")
                {
                    // Tampilkan per bulan dalam 1 tahun
                    var result = Enumerable.Range(1, 12).Select(m =>
                    {
                        var revenue = allOrders
                            .Where(o => o.OrderDate.Year == year && o.OrderDate.Month == m)
                            .Sum(o => o.TotalAmount);
                        return new
                        {
                            Label = new DateTime(year, m, 1).ToString("MMM", new System.Globalization.CultureInfo("id-ID")),
                            Revenue = revenue
                        };
                    }).ToList();

                    return Ok(result);
                }
                else
                {
                    // Tampilkan per minggu dalam 1 bulan
                    if (month == null) return BadRequest(new { message = "Parameter month diperlukan untuk view weekly." });

                    var daysInMonth = DateTime.DaysInMonth(year, month.Value);
                    var result = new List<object>();

                    // Bagi bulan menjadi 4-5 minggu
                    for (int week = 1; week <= 5; week++)
                    {
                        int startDay = (week - 1) * 7 + 1;
                        int endDay = Math.Min(week * 7, daysInMonth);
                        if (startDay > daysInMonth) break;

                        var startDate = new DateTime(year, month.Value, startDay);
                        var endDate = new DateTime(year, month.Value, endDay);

                        var revenue = allOrders
                            .Where(o => o.OrderDate.Date >= startDate && o.OrderDate.Date <= endDate)
                            .Sum(o => o.TotalAmount);

                        result.Add(new
                        {
                            Label = $"Minggu {week}",
                            Revenue = revenue
                        });
                    }

                    return Ok(result);
                }
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
                var months = await _context.Orders
                    .Where(o => o.PaymentStatus == "Lunas")
                    .ToListAsync();

                var result = months
                    .Select(o => new { o.OrderDate.Year, o.OrderDate.Month })
                    .Distinct()
                    .OrderByDescending(x => x.Year)
                    .ThenByDescending(x => x.Month)
                    .Select(x => new
                    {
                        Year = x.Year,
                        Month = x.Month,
                        Label = new DateTime(x.Year, x.Month, 1)
                            .ToString("MMMM yyyy", new System.Globalization.CultureInfo("id-ID"))
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }
    }
}
