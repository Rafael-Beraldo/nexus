using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class OrderDto
        {
            public List<CartItemDto> CartItems { get; set; }
            public decimal Total { get; set; }
            public PaymentDetailsDto PaymentDetails { get; set; }
        }

        public class CartItemDto
        {
            public string ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal Total { get; set; }
        }

        public class PaymentDetailsDto
        {
            public string PaymentMethod { get; set; }
            public string TransactionId { get; set; }
            public DateTime PaymentDate { get; set; }
        }
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [Required]
        public string UserId { get; set; } // String para manter consistência com User

        [Required]
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Status { get; set; } = "Pending"; // Pode ser Pending, Paid, Shipped, Delivered, etc.
    }

    public class OrderItem
    {
        [Required]
        public string ProductId { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; } // Preço unitário
    }
}
