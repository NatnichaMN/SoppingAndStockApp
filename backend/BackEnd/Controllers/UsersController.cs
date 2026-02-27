using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackEnd.DTOs;
using BackEnd.Services;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _userService.GetAllAsync();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateRequest req)
    {
        try
        {
            var result = await _userService.UpdateAsync(id, req);
            return Ok(result);
        }
        catch (ServiceException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message });
        }
    }
}
