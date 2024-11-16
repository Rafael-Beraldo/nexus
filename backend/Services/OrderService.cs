using MongoDB.Driver;
using backend.Models;

namespace backend.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;

        public OrderService(IMongoDatabase database)
        {
            _orders = database.GetCollection<Order>("Orders");
        }

        // Buscar todos os pedidos de um usuário pelo userId
        public async Task<List<Order>> GetOrdersByUserIdAsync(string userId)
        {
            var filter = Builders<Order>.Filter.Eq(order => order.UserId, userId);
            return await _orders.Find(filter).ToListAsync(); // Retorna todos os pedidos
        }

        // Buscar um pedido específico pelo id e userId
        public async Task<Order> GetOrderByIdAsync(string orderId, string userId)
        {
            // Certifique-se de que o userId e o orderId são válidos e correspondem corretamente
            var filter = Builders<Order>.Filter.Eq(order => order.UserId, userId);

            var order = await _orders.Find(filter).FirstOrDefaultAsync();

            // Adicione logs para verificar se a consulta retornou um resultado
            if (order == null)
            {
                Console.WriteLine("Pedido não encontrado.");
            }

            return order;
        }

        // Criar um novo pedido
        public async Task CreateOrderAsync(Order order)
        {
            await _orders.InsertOneAsync(order);
        }

        // Atualizar um pedido existente
        public async Task UpdateOrderAsync(string orderId, Order updateOrder)
        {
            var filter = Builders<Order>.Filter.Eq(order => order.Id, orderId);
            await _orders.ReplaceOneAsync(filter, updateOrder);
        }

        // Excluir um pedido
        public async Task DeleteOrderAsync(string orderId)
        {
            var filter = Builders<Order>.Filter.Eq(order => order.Id, orderId);
            await _orders.DeleteOneAsync(filter);
        }
    }
}
