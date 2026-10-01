using be.Models;
using be.Repositories;

namespace be.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync(string? search = null)
        {
            return await _productRepository.GetAllProductsAsync(search);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            return await _productRepository.CreateProductAsync(product);
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            if (id != product.ProductId)
                return false;

            return await _productRepository.UpdateProductAsync(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteProductAsync(id);
        }
    }
}
