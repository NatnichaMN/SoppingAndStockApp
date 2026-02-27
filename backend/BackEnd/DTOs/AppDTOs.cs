namespace BackEnd.DTOs;

public record LoginRequest(string Username, string Password);
public record RegisterRequest(string Username, string Password, string Role = "user");
public record AuthResponse(string Token, string Username, string Role, int UserId);

public record ProductCreateRequest(
    string Name,
    string Code,
    decimal Price,
    int Stock,
    string Category,
    string? ImageUrl,
    string? Description = null,
    bool IsActive = true
);

public record ProductUpdateRequest(
      string Name,
    string Code,
    decimal Price,
    int Stock,
    string Category,
    string? ImageUrl,
    string? Description = null,
    bool IsActive = true

);

public record OrderItemRequest(int ProductId, int Quantity);

public record CreateOrderRequest(List<OrderItemRequest> Items);

public record ProductResponse(
    int Id,
    string Name,
    string Code,
    string? Description,
    decimal Price,
    int Stock,
    string Category,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record OrderItemResponse(
    int ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal Subtotal
);

public record OrderResponse(
    int Id,
    int UserId,
    string Username,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt,
    List<OrderItemResponse> Items
);



public record TopProductDto(string ProductName, int TotalSold, decimal TotalRevenue);

public record UserResponse(int Id, string Username, string Role, DateTime CreatedAt);
public record UserUpdateRequest(string Username, string Role);
