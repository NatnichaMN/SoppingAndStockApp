using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<ProductResponse>> GetAllAsync(bool isAdmin)
    {
        var query = _db.Products.AsQueryable();

        // Admin can see all products, regular users only active. 
        if (!isAdmin)
            query = query.Where(p => p.IsActive);

        var products = await query.OrderBy(p => p.Name).ToListAsync();
        return products.Select(MapToResponse);
    }

    public async Task<ProductResponse?> GetByIdAsync(int id)
    {
        var product = await _db.Products.FindAsync(id);
        return product == null ? null : MapToResponse(product);
    }

    public async Task<ProductResponse> CreateAsync(ProductCreateRequest req)
    {
        if (req.Price < 0)
            throw new ServiceException("ราคาสินค้าต้องไม่ติดลบ");

        if (req.Stock < 0)
            throw new ServiceException("จำนวนสต็อกต้องไม่ติดลบ");

        var codeProducts = _db.Products
            .FirstOrDefault(x => x.Code == req.Code);
        // Check for duplicate code
        if (codeProducts != null)
        {
            throw new ServiceException("รหัสสินค้านี้มีอยู่แล้ว กรุณาใช้รหัสอื่น");
        }

        var product = new Product
        {
            Name = req.Name,
            Code = req.Code,
            Description = req.Description,
            Price = req.Price,
            Stock = req.Stock,
            Category = req.Category,
            ImageUrl = req.ImageUrl,
            IsActive = req.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return MapToResponse(product);
    }

    public async Task<ProductResponse?> UpdateAsync(int id, ProductUpdateRequest req)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return null;

        if (req.Price < 0)
            throw new ServiceException("ราคาสินค้าต้องไม่ติดลบ");

        if (req.Stock < 0)
            throw new ServiceException("จำนวนสต็อกต้องไม่ติดลบ");

        product.Name = req.Name;
        product.Code = req.Code;
        product.Description = req.Description;
        product.Price = req.Price;
        product.Stock = req.Stock;
        product.Category = req.Category;
        product.IsActive = req.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToResponse(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        // Soft delete: mark as inactive เมื่อต้องการเอาสินค้าออกจากการแสดงผล แต่ยังเก็บข้อมูลไว้ในฐานข้อมูล
        var product = await _db.Products.FindAsync(id);
        if (product == null) return false;

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }


    private static ProductResponse MapToResponse(Product p) =>
        new(
            p.Id,
            p.Name,
            p.Code,
            p.Description,
            p.Price,
            p.Stock,
            p.Category,
            p.ImageUrl,
            p.IsActive,
            p.CreatedAt,
            p.UpdatedAt
        );
}
