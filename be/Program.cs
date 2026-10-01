using Microsoft.EntityFrameworkCore;
using be.Data;
using be.Repositories;
using be.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. DAFTARKAN KONEKSI DATABASE KE SQL SERVER
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. DAFTARKAN REPOSITORIES (Data Access Layer)
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// 3. DAFTARKAN SERVICES (Business Logic Layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// 4. DAFTARKAN POLICY CORS (Izinkan Frontend Mengakses API)
builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp",
            policy =>
            {
                policy.WithOrigins(
                          "http://localhost:5173",           // Local development
                          "http://192.168.5.103:5029",       // Backend IP (untuk CORS dari client lain)
                          "https://3254jhsj-5029.asse.devtunnels.ms" // Dev Tunnels (backup)
                      )
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
    });

// 5. Naikkan batas ukuran upload file (default 28MB, kita set 50MB)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52_428_800; // 50 MB
});
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52_428_800; // 50 MB
});

builder.Services.AddControllers();

// Disable Swagger temporarily for .NET 10 compatibility
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

// Disable Swagger temporarily
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

// 6. AKTIFKAN STATIC FILES (untuk serve foto dari wwwroot/uploads)
app.UseStaticFiles();

// 7. AKTIFKAN MIDDLEWARE CORS (Harus dipasang SEBELUM app.MapControllers)
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();