using BackEnd.DTOs;

namespace BackEnd.Services;

public interface IOrderService
{
    Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest req);
    Task<IEnumerable<OrderResponse>> GetOrdersAsync(int userId, bool isAdmin);
    Task<OrderResponse?> GetByIdAsync(int id);
}
