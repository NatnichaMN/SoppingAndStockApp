using BackEnd.DTOs;

namespace BackEnd.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(string username, string password);
    Task<AuthResponse> RegisterAsync(string username, string password);
}
