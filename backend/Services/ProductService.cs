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
            // Agora, id é uma string, não é necessário tentar converter para ObjectId
            return await _products.Find(product => product.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateProductAsync(Product product)
        {
            // O produto agora usa string para Id, sem a necessidade de conversão
            await _products.InsertOneAsync(product);
        }

        public async Task UpdateProductAsync(string id, Product updatedProduct)
        {
            // Verificando se o Id do produto a ser atualizado corresponde ao tipo string
            updatedProduct.Id = id;  // Passando o id direto, sem conversão

            await _products.ReplaceOneAsync(product => product.Id == id, updatedProduct);
        }

        public async Task DeleteProductAsync(string id)
        {
            // Agora o id é do tipo string, então podemos usar diretamente
            await _products.DeleteOneAsync(product => product.Id == id);
        }
    }
}
