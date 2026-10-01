using be.Models;

namespace be.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync(string? search = null);
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);
        Task<bool> ProductExistsAsync(int id);
    }
}
