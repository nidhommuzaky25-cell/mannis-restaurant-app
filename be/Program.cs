using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using be.Data;
using be.Repositories;
using be.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. DAFTARKAN KONEKSI DATABASE KE POSTGRESQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. DAFTARKAN REPOSITORIES (Data Access Layer)
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// 3. DAFTARKAN SERVICES (Business Logic Layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// 4. DAFTARKAN JWT AUTHENTICATION
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
    };
});

builder.Services.AddAuthorization();

// 5. DAFTARKAN POLICY CORS (Izinkan Frontend Mengakses API)
builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp",
            policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                      {
                          // Allow localhost dengan port berapa saja
                          if (origin.StartsWith("http://localhost:") || origin.StartsWith("https://localhost:"))
                              return true;
                          
                          // Allow 127.0.0.1 dengan port berapa saja
                          if (origin.StartsWith("http://127.0.0.1:") || origin.StartsWith("https://127.0.0.1:"))
                              return true;
                          
                          // Allow semua IP private network (192.168.x.x)
                          if (origin.StartsWith("http://192.168.") || origin.StartsWith("https://192.168."))
                              return true;
                          
                          // Allow dev tunnels
                          if (origin.Contains("devtunnels.ms"))
                              return true;
                          
                          return false;
                      })
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials(); // Penting untuk cookies/auth
            });
    });

// 6. Naikkan batas ukuran upload file (default 28MB, kita set 50MB)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52_428_800; // 50 MB
});
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52_428_800; // 50 MB
});

builder.Services.AddControllers();

// Enable Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Redirect root URL to Swagger
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

app.UseHttpsRedirection();

// 6. AKTIFKAN STATIC FILES (untuk serve foto dari wwwroot/uploads)
app.UseStaticFiles();

// 7. AKTIFKAN AUTHENTICATION & AUTHORIZATION (Harus sebelum MapControllers)
app.UseAuthentication();
app.UseAuthorization();

// 8. AKTIFKAN MIDDLEWARE CORS (Harus dipasang SEBELUM app.MapControllers)
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();