using BackEnd.DTOs;

namespace BackEnd.Services;

public interface IProductService
{
    Task<IEnumerable<ProductResponse>> GetAllAsync(bool isAdmin);
    Task<ProductResponse?> GetByIdAsync(int id);
    Task<ProductResponse> CreateAsync(ProductCreateRequest req);
    Task<ProductResponse?> UpdateAsync(int id, ProductUpdateRequest req);
    Task<bool> DeleteAsync(int id);
}
