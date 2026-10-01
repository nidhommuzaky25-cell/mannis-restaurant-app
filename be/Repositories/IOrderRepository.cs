using be.Models;

namespace be.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetAllOrdersAsync(string? search = null);
        Task<Order?> GetOrderByIdAsync(int id);
        Task<Order?> GetOrderWithDetailsAsync(int id);
        Task<bool> UpdateOrderStatusAsync(int id, string status);
    }
}
