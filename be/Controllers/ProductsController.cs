using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.Models;
using be.Services;

namespace be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _env;

        public ProductsController(IProductService productService, IWebHostEnvironment env)
        {
            _productService = productService;
            _env = env;
        }

        // GET /api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? search)
        {
            try
            {
                var products = await _productService.GetAllProductsAsync(search);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message} -> {ex.InnerException?.Message}");
            }
        }

        // GET /api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "Menu tidak ditemukan." });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // POST /api/products/upload-image
        [HttpPost("upload-image")]
        [Authorize] // Only authenticated admin can upload
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "File tidak boleh kosong." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                return BadRequest(new { message = "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP." });

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var host = Request.Headers["X-Forwarded-Host"].FirstOrDefault()
                       ?? Request.Headers["X-Original-Host"].FirstOrDefault()
                       ?? Request.Host.ToString();
            var scheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault()
                         ?? Request.Scheme;
            var baseUrl = $"{scheme}://{host}";
            var imageUrl = $"{baseUrl}/uploads/{fileName}";

            return Ok(new { imageUrl });
        }

        // POST /api/products
        [HttpPost]
        [Authorize] // Only authenticated admin can create
        public async Task<ActionResult<Product>> CreateProduct([FromBody] Product product)
        {
            try
            {
                var createdProduct = await _productService.CreateProductAsync(product);
                return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.ProductId }, createdProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // PUT /api/products/5
        [HttpPut("{id}")]
        [Authorize] // Only authenticated admin can update
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.ProductId)
                return BadRequest(new { message = "ID tidak cocok." });

            try
            {
                var success = await _productService.UpdateProductAsync(id, product);
                if (!success)
                    return NotFound(new { message = "Produk tidak ditemukan." });
                
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // DELETE /api/products/5
        [HttpDelete("{id}")]
        [Authorize] // Only authenticated admin can delete
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var success = await _productService.DeleteProductAsync(id);
                if (!success)
                    return NotFound(new { message = "Produk tidak ditemukan." });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
