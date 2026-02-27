using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BackEnd.DTOs;
using BackEnd.Services;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _orderService.CreateOrderAsync(userId, req);
            return Ok(result);
        }
        catch (ServiceException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _orderService.GetOrdersAsync(userId, User.IsInRole("admin"));
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _orderService.GetByIdAsync(id);
        if (result == null) return NotFound();
        if (!User.IsInRole("admin") && result.UserId != userId) return Forbid();
        return Ok(result);
    }
}
