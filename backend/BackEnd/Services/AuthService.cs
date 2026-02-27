using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponse> LoginAsync(string username, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            throw new ServiceException("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);

        return new AuthResponse(GenerateToken(user), user.Username, user.Role, user.Id);
    }

    public async Task<AuthResponse> RegisterAsync(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            throw new ServiceException("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");

        if (password.Length < 6)
            throw new ServiceException("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");

        if (await _db.Users.AnyAsync(u => u.Username == username))
            throw new ServiceException("ชื่อผู้ใช้นี้มีอยู่แล้ว");

        var user = new User
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = "user"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponse(GenerateToken(user), user.Username, user.Role, user.Id);
    }

    private string GenerateToken(User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? "BackEndSecretKey2024!@#$%^&*()_+";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "BackEndApi",
            // audience must match the value expected by validation (defaults to "BackEndApi")
            audience: _config["Jwt:Audience"] ?? "BackEndApi",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
