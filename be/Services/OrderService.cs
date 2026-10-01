using be.Models;
using be.DTOs;
using be.Repositories;

namespace be.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<(bool IsSuccess, Order? Order, string? ErrorMessage)> CreateOrderAsync(OrderCreateDto dto)
        {
            if (dto.CartItems == null || !dto.CartItems.Any())
            {
                return (false, null, "Keranjang belanja tidak boleh kosong.");
            }

            decimal totalAmount = 0;
            var orderDetailsList = new List<OrderDetail>();

            // Validasi semua produk di keranjang
            foreach (var item in dto.CartItems)
            {
                var product = await _productRepository.GetProductByIdAsync(item.ProductId);
                if (product == null)
                {
                    return (false, null, $"Produk dengan ID {item.ProductId} tidak ditemukan.");
                }

                if (!product.IsAvailable)
                {
                    return (false, null, $"Maaf, produk '{product.ProductName}' sedang habis.");
                }

                decimal itemPrice = product.Price;
                totalAmount += itemPrice * item.Quantity;

                orderDetailsList.Add(new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = itemPrice
                });
            }

            var order = new Order
            {
                TableNumber = dto.TableNumber,
                TotalAmount = totalAmount,
                PaymentStatus = "Belum Bayar",
                OrderDate = DateTime.Now,
                OrderDetails = orderDetailsList
            };

            var createdOrder = await _orderRepository.CreateOrderAsync(order);
            return (true, createdOrder, null);
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync(string? search = null)
        {
            return await _orderRepository.GetAllOrdersAsync(search);
        }

        public async Task<(bool IsSuccess, string? ErrorMessage)> MarkAsLunasAsync(int id)
        {
            var success = await _orderRepository.UpdateOrderStatusAsync(id, "Lunas");
            if (!success)
            {
                return (false, "Orderan tidak ditemukan.");
            }
            return (true, null);
        }

        public async Task<Order?> GetOrderReceiptAsync(int id)
        {
            return await _orderRepository.GetOrderWithDetailsAsync(id);
        }
    }
}
