using MongoDB.Driver;
using MongoDB.Bson;
using backend.Models;

namespace backend.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _products;

        public ProductService(IMongoDatabase database)
        {
            _products = database.GetCollection<Product>("Products");
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _products.Find(product => true).ToListAsync();
        }

        public async Task<Product> GetProductByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return null;
            }

            return await _products.Find(product => product.Id == objectId).FirstOrDefaultAsync();
        }

        public async Task CreateProductAsync(Product product)
        {
            await _products.InsertOneAsync(product);
        }

        public async Task UpdateProductAsync(string id, Product updatedProduct)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return;
            }

            updatedProduct.Id = objectId;  
            await _products.ReplaceOneAsync(product => product.Id == objectId, updatedProduct);
        }

        public async Task DeleteProductAsync(string id)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return;
            }

            await _products.DeleteOneAsync(product => product.Id == objectId);
        }
    }
}
