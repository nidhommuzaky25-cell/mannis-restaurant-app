using Microsoft.AspNetCore.Mvc;
using be.Models;
using be.DTOs;
using be.Services;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST /api/orders (Proses Checkout Pesanan)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            var (isSuccess, order, errorMessage) = await _orderService.CreateOrderAsync(dto);

            if (!isSuccess)
            {
                if (errorMessage != null && errorMessage.Contains("tidak ditemukan"))
                {
                    return NotFound(new { message = errorMessage });
                }
                return BadRequest(new { message = errorMessage });
            }

            // Kembalikan response sukses beserta seluruh data pesanan
            return Ok(new
            {
                message = "Pesanan berhasil dibuat!",
                orderId = order!.OrderId,
                tableNumber = order.TableNumber,
                totalAmount = order.TotalAmount,
                status = order.PaymentStatus,
                items = order.OrderDetails.Select(od => new {
                    od.ProductId,
                    quantity = od.Quantity,
                    price = od.Price
                })
            });
        }

        // ADMIN & SUCCESS PAGE: LIHAT SEMUA ORDER DENGAN FITUR SEARCH NAMA / MEJA / ID
        // GET /api/orders?search=2
        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] string? search)
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync(search);

                // Mapping data agar rapi dan cocok dengan penamaan TypeScript frontend
                var result = orders.Select(o => new
                {
                    o.OrderId,
                    o.TableNumber,
                    o.OrderDate,
                    o.TotalAmount,
                    Status = o.PaymentStatus,
                    itemsBeli = o.OrderDetails.Select(od => new
                    {
                        NamaProduk = od.Product != null ? od.Product.ProductName : "Produk Dihapus",
                        od.Quantity,
                        od.Price
                    })
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal Server Error: {ex.Message}" });
            }
        }

        // ADMIN: MARK AS LUNAS (Ubah Status)
        // PUT /api/orders/5/lunas
        [HttpPut("{id}/lunas")]
        public async Task<IActionResult> MarkAsLunas(int id)
        {
            var (isSuccess, errorMessage) = await _orderService.MarkAsLunasAsync(id);

            if (!isSuccess)
            {
                return NotFound(new { message = errorMessage });
            }

            return Ok(new { message = "Status orderan berhasil diubah menjadi Lunas!", status = "Lunas" });
        }

        // ADMIN: AMBIL DATA STRUK PEMBELIAN
        // GET /api/orders/5/struk
        [HttpGet("{id}/struk")]
        public async Task<IActionResult> GetReceipt(int id)
        {
            var order = await _orderService.GetOrderReceiptAsync(id);

            if (order == null)
            {
                return NotFound(new { message = "Orderan tidak ditemukan." });
            }

            if (order.PaymentStatus != "Lunas")
            {
                return BadRequest(new { message = "Struk belum bisa dibuat karena pesanan belum lunas." });
            }

            // Struktur data struk belanja restoran
            var receipt = new
            {
                NamaResto = "Barcode Resto & Cafe",
                Alamat = "Jl. Sudirman No. 3PM",
                WaktuCetak = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                NoNota = $"INV-{order.OrderId.ToString().PadLeft(5, '0')}",
                Meja = order.TableNumber,
                WaktuOrder = order.OrderDate.ToString("yyyy-MM-dd HH:mm:ss"),
                ItemBelanja = order.OrderDetails.Select(od => new
                {
                    Menu = od.Product != null ? od.Product.ProductName : "Produk Dihapus",
                    od.Quantity,
                    HargaSatuan = od.Price,
                    SubTotal = od.Price * od.Quantity
                }),
                TotalBayar = order.TotalAmount,
                StatusPembayaran = order.PaymentStatus
            };

            return Ok(receipt);
        }
    }
}