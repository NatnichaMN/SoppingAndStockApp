using BackEnd.DTOs;

namespace BackEnd.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<UserResponse> UpdateAsync(int id, UserUpdateRequest req);
}
