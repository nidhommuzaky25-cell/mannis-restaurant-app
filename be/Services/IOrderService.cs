using be.Models;
using be.DTOs;

namespace be.Services
{
    public interface IOrderService
    {
        Task<(bool IsSuccess, Order? Order, string? ErrorMessage)> CreateOrderAsync(OrderCreateDto dto);
        Task<IEnumerable<Order>> GetAllOrdersAsync(string? search = null);
        Task<Order?> GetOrderByIdAsync(int id);
        Task<(bool IsSuccess, string? ErrorMessage)> MarkAsLunasAsync(int id);
        Task<Order?> GetOrderReceiptAsync(int id);
    }
}
