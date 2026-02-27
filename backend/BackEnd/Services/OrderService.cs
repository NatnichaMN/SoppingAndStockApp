using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db) => _db = db;

    public async Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest req)
    {
        var productIds = req.Items.Select(i => i.ProductId).ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToListAsync();

        // Validate all products exist and have enough stock
        foreach (var item in req.Items)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId);

            if (product == null)
                throw new ServiceException($"ไม่พบสินค้า Id: {item.ProductId}");

            if (item.Quantity <= 0)
                throw new ServiceException($"จำนวนสินค้าของ '{product.Name}' ไม่ถูกต้อง");

         
            if (item.Quantity > product.Stock)
            {
                throw new ServiceException($"สินค้า '{product.Name}' มีสต็อคไม่เพียงพอ (เหลือ {product.Stock} ชิ้น)");
            }
        }

        var order = new Order
        {
            UserId = userId,
            Status = "completed",
            CreatedAt = DateTime.UtcNow
        };

        decimal total = 0;
        foreach (var item in req.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            };
            // Calculate total amount
            total += orderItem.Quantity * orderItem.UnitPrice;
            order.OrderItems.Add(orderItem);

            product.Stock -= item.Quantity;
            

            product.UpdatedAt = DateTime.UtcNow;
        }

        order.TotalAmount = total;
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(order.Id))!;
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersAsync(int userId, bool isAdmin)
    {
        var query = _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .AsQueryable();

        if (!isAdmin)
            query = query.Where(o => o.UserId == userId);

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return orders.Select(MapToResponse);
    }

    public async Task<OrderResponse?> GetByIdAsync(int id)
    {
        var order = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : MapToResponse(order);
    }

    private static OrderResponse MapToResponse(Order o) => new(
        o.Id,
        o.UserId,
        o.User?.Username ?? "",
        o.TotalAmount,
        o.Status,
        o.CreatedAt,
        o.OrderItems.Select(oi => new OrderItemResponse(
            oi.ProductId,
            oi.Product?.Name ?? "",
            oi.Quantity,
            oi.UnitPrice,
            oi.Quantity * oi.UnitPrice
        )).ToList()
    );
}
