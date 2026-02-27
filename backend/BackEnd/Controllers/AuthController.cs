using Microsoft.AspNetCore.Mvc;
using BackEnd.DTOs;
using BackEnd.Services;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        try
        {
            var result = await _authService.LoginAsync(req.Username, req.Password);
            return Ok(result);
        }
        catch (ServiceException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        try
        {
            var result = await _authService.RegisterAsync(req.Username, req.Password);
            return Ok(result);
        }
        catch (ServiceException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message });
        }
    }
}
