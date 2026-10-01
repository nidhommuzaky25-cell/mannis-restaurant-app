using Microsoft.EntityFrameworkCore;
using be.Data;

namespace be.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetDashboardStatsAsync()
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

            // Chart default: 7 hari terakhir
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

            return new
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                ProductSold = productSold,
                RecentOrders = recentOrders,
                RevenueChart = revenueChart
            };
        }

        public async Task<object> GetChartDataAsync(int year, int? month, string view = "weekly")
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

                return result;
            }
            else
            {
                // Tampilkan per minggu dalam 1 bulan
                if (month == null)
                    throw new ArgumentException("Parameter month diperlukan untuk view weekly.");

                var daysInMonth = DateTime.DaysInMonth(year, month.Value);
                var result = new List<object>();

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

                return result;
            }
        }

        public async Task<object> GetAvailableMonthsAsync()
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

            return result;
        }
    }
}
