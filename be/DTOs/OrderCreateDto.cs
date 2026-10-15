using System.Text.Json.Serialization;

namespace be.DTOs
{
    public class OrderCreateDto
    {
        public string? CustomerName { get; set; } // NULLABLE: Customer name (optional for backward compatibility)
        public string TableNumber { get; set; } = string.Empty;
        
        [JsonPropertyName("additionalNotes")] // Map from frontend field name
        public string? GeneralNotes { get; set; } // NULLABLE: General notes (optional)
        
        public List<CartItemDto> CartItems { get; set; } = new();
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string? Notes { get; set; } // NEW: Item-specific notes
    }
}