using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // Rota para pegar os pedidos do usuário autenticado
        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuário não autenticado");
            }

            var orders = await _orderService.GetOrdersByUserIdAsync(userId);

            if (orders == null || orders.Count == 0)
            {
                return NotFound("Pedidos não encontrados.");
            }

            return Ok(orders);
        }

        // Rota para pegar um pedido específico pelo ID, mas também associada ao usuário autenticado
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(string id)
        {
            // Obtém o userId do usuário autenticado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuário não autenticado");
            }

            // Busca o pedido com o userId e orderId
            var order = await _orderService.GetOrderByIdAsync(id, userId);

            if (order == null)
            {
                return NotFound("Pedido não encontrado.");
            }

            return Ok(order);
        }

        [HttpGet("user-orders")] // Altere a rota para uma que reflita que estamos buscando múltiplos pedidos
        public async Task<ActionResult<List<Order>>> GetOrdersByUserId()
        {
            // Obtém o userId do usuário autenticado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuário não autenticado");
            }

            // Busca todos os pedidos do usuário
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);

            if (orders == null || orders.Count == 0)
            {
                return NotFound("Nenhum pedido encontrado.");
            }

            return Ok(orders); // Retorna todos os pedidos do usuário
        }

        // Rota para criar um pedido, associando ao ID do usuário
        [HttpPost]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuário não autenticado");
            }

            order.UserId = userId; // Associa o pedido ao usuário autenticado
            await _orderService.CreateOrderAsync(order);

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }
    }
}
