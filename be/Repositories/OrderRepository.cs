using Microsoft.EntityFrameworkCore;
using be.Data;
using be.Models;

namespace be.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync(string? search = null)
        {
            var query = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                if (int.TryParse(search, out int searchId))
                {
                    query = query.Where(o => o.OrderId == searchId || o.TableNumber.Contains(search));
                }
                else
                {
                    query = query.Where(o => o.TableNumber.Contains(search));
                }
            }

            return await query.OrderByDescending(o => o.OrderDate).ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task<Order?> GetOrderWithDetailsAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            order.PaymentStatus = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
