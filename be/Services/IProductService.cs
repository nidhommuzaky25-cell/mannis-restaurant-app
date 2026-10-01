using be.Models;

namespace be.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync(string? search = null);
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<bool> UpdateProductAsync(int id, Product product);
        Task<bool> DeleteProductAsync(int id);
    }
}
