namespace be.Models
{
    public class OrderDetail
    {
        public int OrderDetailId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Notes { get; set; } // NEW: Special notes for this item (e.g., "Pedas level 5", "Tanpa bawang")

        // Navigation properties
        public Product? Product { get; set; }
    }
}