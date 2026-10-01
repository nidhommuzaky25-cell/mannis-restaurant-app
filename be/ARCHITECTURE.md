# Backend Architecture - Clean Architecture Pattern

## Overview
Backend ini telah direfactor menggunakan **Repository Pattern** dan **Service Layer** untuk memisahkan concerns dan meningkatkan maintainability.

## Struktur Folder

```
be/
├── Controllers/          # HTTP Request Handlers
│   ├── AuthController.cs
│   ├── DashboardController.cs
│   ├── OrdersController.cs
│   └── ProductsController.cs
├── Services/            # Business Logic Layer
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── IDashboardService.cs
│   ├── DashboardService.cs
│   ├── IOrderService.cs
│   ├── OrderService.cs
│   ├── IProductService.cs
│   └── ProductService.cs
├── Repositories/        # Data Access Layer
│   ├── IAdminRepository.cs
│   ├── AdminRepository.cs
│   ├── IOrderRepository.cs
│   ├── OrderRepository.cs
│   ├── IProductRepository.cs
│   └── ProductRepository.cs
├── Data/               # Database Context
│   └── AppDbContext.cs
├── Models/             # Domain Entities
├── DTOs/               # Data Transfer Objects
└── Program.cs          # Dependency Injection Configuration
```

## Layers Explained

### 1. Controllers (Presentation Layer)
**Tanggung Jawab:**
- Menerima HTTP requests
- Validasi input dasar
- Memanggil Services
- Mengembalikan HTTP responses

**Contoh:**
```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? search)
{
    var products = await _productService.GetAllProductsAsync(search);
    return Ok(products);
}
```

**Aturan:**
- ❌ TIDAK boleh akses DbContext langsung
- ❌ TIDAK boleh mengandung business logic
- ✅ Hanya handle HTTP concerns (request/response)
- ✅ Inject Services via constructor

### 2. Services (Business Logic Layer)
**Tanggung Jawab:**
- Business logic dan validasi kompleks
- Koordinasi antar repositories
- Transform data untuk kebutuhan bisnis
- Return meaningful responses

**Contoh:**
```csharp
public async Task<(bool IsSuccess, Order? Order, string? ErrorMessage)> CreateOrderAsync(OrderCreateDto dto)
{
    // Validasi business logic
    if (dto.CartItems == null || !dto.CartItems.Any())
        return (false, null, "Keranjang belanja tidak boleh kosong.");

    // Koordinasi dengan repositories
    foreach (var item in dto.CartItems)
    {
        var product = await _productRepository.GetProductByIdAsync(item.ProductId);
        if (!product.IsAvailable)
            return (false, null, $"Produk '{product.ProductName}' sedang habis.");
    }
    
    // Create order
    return (true, createdOrder, null);
}
```

**Aturan:**
- ✅ Inject Repositories (bukan DbContext)
- ✅ Contain business rules
- ✅ Return tuples atau custom result objects
- ❌ TIDAK handle HTTP concerns

### 3. Repositories (Data Access Layer)
**Tanggung Jawab:**
- Direct database operations (CRUD)
- Query building
- Data persistence
- No business logic

**Contoh:**
```csharp
public async Task<IEnumerable<Product>> GetAllProductsAsync(string? search = null)
{
    var query = _context.Products.AsQueryable();
    
    if (!string.IsNullOrEmpty(search))
        query = query.Where(p => p.ProductName.Contains(search));
    
    return await query.ToListAsync();
}
```

**Aturan:**
- ✅ Inject DbContext
- ✅ Only database operations
- ❌ TIDAK ada business logic
- ❌ TIDAK ada validasi bisnis

## Dependency Injection Setup

Di `Program.cs`, semua services dan repositories didaftarkan dengan **Scoped lifetime**:

```csharp
// Repositories (Data Access Layer)
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Services (Business Logic Layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Controllers: Handle HTTP
- Services: Business logic
- Repositories: Database access

### 2. **Testability**
- Mock repositories untuk test services
- Mock services untuk test controllers
- Tidak perlu database untuk unit testing

### 3. **Maintainability**
- Perubahan database logic hanya di repositories
- Perubahan business rules hanya di services
- API changes hanya di controllers

### 4. **Reusability**
- Services dapat dipanggil dari berbagai controllers
- Repositories dapat dipakai oleh berbagai services

### 5. **Loose Coupling**
- Dependency pada interfaces, bukan concrete classes
- Mudah mengganti implementasi

## Data Flow

```
HTTP Request
    ↓
Controller (Validate HTTP input)
    ↓
Service (Business logic & validation)
    ↓
Repository (Database operations)
    ↓
Database
    ↓
Repository (Return entities)
    ↓
Service (Transform & business rules)
    ↓
Controller (HTTP response)
    ↓
HTTP Response
```

## Example: Create Order Flow

### 1. Controller receives request
```csharp
[HttpPost]
public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
{
    var (isSuccess, order, errorMessage) = await _orderService.CreateOrderAsync(dto);
    
    if (!isSuccess)
        return BadRequest(new { message = errorMessage });
    
    return Ok(new { orderId = order.OrderId, ... });
}
```

### 2. Service handles business logic
```csharp
public async Task<(bool, Order?, string?)> CreateOrderAsync(OrderCreateDto dto)
{
    // Validate cart
    if (dto.CartItems == null || !dto.CartItems.Any())
        return (false, null, "Keranjang kosong");
    
    // Check product availability
    foreach (var item in dto.CartItems)
    {
        var product = await _productRepository.GetProductByIdAsync(item.ProductId);
        if (!product.IsAvailable)
            return (false, null, $"Produk {product.ProductName} habis");
    }
    
    // Create order
    var order = new Order { ... };
    var created = await _orderRepository.CreateOrderAsync(order);
    
    return (true, created, null);
}
```

### 3. Repository persists data
```csharp
public async Task<Order> CreateOrderAsync(Order order)
{
    _context.Orders.Add(order);
    await _context.SaveChangesAsync();
    return order;
}
```

## Migration Notes

### Before (Direct DbContext in Controller)
```csharp
// ❌ BAD: Business logic in controller
public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
{
    if (dto.CartItems == null || !dto.CartItems.Any())
        return BadRequest(...);
    
    foreach (var item in dto.CartItems)
    {
        var product = await _context.Products.FindAsync(item.ProductId);
        // ... validation logic
    }
    
    var order = new Order { ... };
    _context.Orders.Add(order);
    await _context.SaveChangesAsync();
    
    return Ok(order);
}
```

### After (Clean Architecture)
```csharp
// ✅ GOOD: Delegated to service
public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
{
    var (isSuccess, order, errorMessage) = await _orderService.CreateOrderAsync(dto);
    
    if (!isSuccess)
        return BadRequest(new { message = errorMessage });
    
    return Ok(order);
}
```

## Best Practices

### ✅ DO
- Keep controllers thin
- Put business logic in services
- Use interfaces for dependency injection
- Return meaningful error messages from services
- Use DTOs for input/output
- Use async/await consistently

### ❌ DON'T
- Access DbContext directly from controllers
- Put business logic in repositories
- Create circular dependencies
- Mix HTTP concerns with business logic
- Return entities directly from services (use DTOs when needed)

## Future Improvements

1. **Add Unit Tests**
   - Test services with mocked repositories
   - Test controllers with mocked services

2. **Add Validation Layer**
   - FluentValidation for DTO validation
   - Move validation out of services

3. **Add Result Pattern**
   - Create `Result<T>` class for consistent responses
   - Replace tuples with Result objects

4. **Add AutoMapper**
   - Automatic entity to DTO mapping
   - Reduce boilerplate code

5. **Add Logging**
   - ILogger in services and repositories
   - Track important operations

6. **Add Caching**
   - Cache frequently accessed data
   - Reduce database queries

## Feedback Implementation

✅ **Feedback dari Mentor PKL:** "Operasi database bisa dipisah jadi beda file, entah Services/ atau Repositories/"

**Implementasi:**
- ✅ Created `Repositories/` folder with interfaces and implementations
- ✅ Created `Services/` folder with business logic
- ✅ Refactored all controllers to use services
- ✅ Registered all dependencies in `Program.cs`
- ✅ Separated data access from business logic
- ✅ Applied Clean Architecture principles

## Contacts

Jika ada pertanyaan atau feedback lebih lanjut tentang arsitektur ini, silakan diskusikan dengan mentor PKL.
