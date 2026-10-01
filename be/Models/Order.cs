namespace be.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = "Belum Bayar"; // Belum Bayar, Lunas

        // Relasi ke detail item
        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}