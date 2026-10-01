namespace be.Services
{
    public interface IDashboardService
    {
        Task<object> GetDashboardStatsAsync();
        Task<object> GetChartDataAsync(int year, int? month, string view = "weekly");
        Task<object> GetAvailableMonthsAsync();
    }
}
