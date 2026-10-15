namespace be.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string? CustomerName { get; set; } // NULLABLE: untuk handle data lama yang NULL
        public string TableNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = "Belum Bayar"; // Belum Bayar, Lunas
        public string? AdditionalNotes { get; set; } // NULLABLE: catatan tambahan dari customer

        // Relasi ke detail item
        public List<OrderDetail> OrderDetails { get; set; } = new();
    }
}