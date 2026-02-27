using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;

namespace BackEnd.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<UserResponse>> GetAllAsync()
    {
        return await _db.Users
            .OrderBy(u => u.Id)
            .Select(u => new UserResponse(u.Id, u.Username, u.Role, u.CreatedAt))
            .ToListAsync();
    }

    public async Task<UserResponse> UpdateAsync(int id, UserUpdateRequest req)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            throw new ServiceException("ไม่พบผู้ใช้", 404);

        if (req.Role != "admin" && req.Role != "user")
            throw new ServiceException("Role ต้องเป็น admin หรือ user เท่านั้น");

        if (string.IsNullOrWhiteSpace(req.Username))
            throw new ServiceException("กรุณากรอกชื่อผู้ใช้");

        if (await _db.Users.AnyAsync(u => u.Username == req.Username && u.Id != id))
            throw new ServiceException("ชื่อผู้ใช้นี้มีอยู่แล้ว");
        
      

        user.Username = req.Username;
        user.Role = req.Role;
        await _db.SaveChangesAsync();

        return new UserResponse(user.Id, user.Username, user.Role, user.CreatedAt);
    }
}
