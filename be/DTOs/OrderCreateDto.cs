namespace be.DTOs
{
    public class OrderCreateDto
    {
        public string TableNumber { get; set; } = string.Empty;
        public List<CartItemDto> CartItems { get; set; } = new();
    }

    public class CartItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}