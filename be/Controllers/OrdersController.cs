using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using be.Data;
using be.Models;
using be.DTOs;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/orders (Proses Checkout Pesanan)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            if (dto.CartItems == null || !dto.CartItems.Any())
            {
                return BadRequest(new { message = "Keranjang belanja tidak boleh kosong." });
            }

            decimal totalAmount = 0;
            var orderDetailsList = new List<OrderDetail>();

            // Loop semua item di keranjang untuk divalidasi harganya dari database
            foreach (var item in dto.CartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    return NotFound(new { message = $"Produk dengan ID {item.ProductId} tidak ditemukan." });
                }

                if (!product.IsAvailable)
                {
                    return BadRequest(new { message = $"Maaf, produk '{product.ProductName}' sedang habis." });
                }

                // Hitung subtotal produk
                decimal itemPrice = product.Price;
                totalAmount += itemPrice * item.Quantity;

                // Masukkan ke penampung detail order
                orderDetailsList.Add(new OrderDetail
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = itemPrice
                });
            }

            // Simpan Data Utama Order
            var order = new Order
            {
                TableNumber = dto.TableNumber,
                TotalAmount = totalAmount,
                PaymentStatus = "Belum Bayar", // Default awal sesuai requirement
                OrderDate = DateTime.Now,
                OrderDetails = orderDetailsList
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Kembalikan response sukses beserta seluruh data pesanan untuk halaman order customer
            return Ok(new
            {
                message = "Pesanan berhasil dibuat!",
                orderId = order.OrderId,
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
                // Ambil data order termasuk detail item dan nama produknya (Eager Loading)
                var query = _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .AsQueryable();

                // Fitur Search yang ditingkatkan: Bisa membaca ID Order (Angka) atau Nomor Meja
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

                var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync();

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
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Orderan tidak ditemukan." });
            }

            order.PaymentStatus = "Lunas";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status orderan berhasil diubah menjadi Lunas!", status = order.PaymentStatus });
        }

        // ADMIN: AMBIL DATA STRUK PEMBELIAN
        // GET /api/orders/5/struk
        [HttpGet("{id}/struk")]
        public async Task<IActionResult> GetReceipt(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);

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