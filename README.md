# Shopping App

ระบบจัดการสินค้าและการขาย — Backend .NET 8 + Frontend React (Vite)

---

## Tech Stack

| ฝั่ง     | เทคโนโลยี                                       |
| -------- | ----------------------------------------------- |
| Backend  | .NET 8, ASP.NET Core, Entity Framework, SQLite  |
| Frontend | React 19, Vite, Ant Design, Axios, React Router |

---



### Backend (ASP.NET Core)

```bash
cd backend/BackEnd
dotnet run --launch-profile https
```
Swagger UI: `https://localhost:7121/swagger`

### Frontend (React + Vite)

```bash
cd frontend/FrontEndShopping
npm install       
npm start      
```

Frontend จะรันที่ `https://localhost:5173`


## บัญชีทดสอบ

| Role  | Username | Password  |
| ----- | -------- | --------- |
| Admin | admin    | admin1234 |
| User  | user | user1234        |

---

## โครงสร้างโปรเจกต์

```
ShoppingApp/
├── backend/BackEnd/
│   ├── Controllers/        # HTTP layer — รับ request, ตอบ response
│   │   ├── AuthController.cs
│   │   ├── ProductsController.cs
│   │   ├── OrdersController.cs
│   │   ├── DashboardController.cs
│   │   └── UsersController.cs
│   ├── Services/           # Business logic + validation
│   │   ├── ServiceException.cs
│   │   ├── IAuthService.cs / AuthService.cs
│   │   ├── IProductService.cs / ProductService.cs
│   │   ├── IOrderService.cs / OrderService.cs
│   │   ├── IDashboardService.cs / DashboardService.cs
│   │   └── IUserService.cs / UserService.cs
│   ├── Models/             # EF Core entities
│   │   ├── User.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   ├── DTOs/               # Request/Response contracts
│   │   └── AppDTOs.cs
│   ├── Data/
│   │   └── AppDbContext.cs  # EF Core DbContext + seed data
│   └── Program.cs           # Entry point, DI, middleware
│
└── frontend/FrontEndShopping/
    └── src/
        ├── App.jsx              # Routing + Auth guard
        ├── context/
        │   ├── AuthContext.jsx  # Global user state + JWT
        │   └── CartContext.jsx  # Global cart state
        ├── layouts/
        │   ├── AdminLayout.jsx  # Sidebar + header (admin)
        │   └── UserLayout.jsx   # Header + cart icon (user)
        ├── pages/
        │   ├── Login.jsx        # Tab login/register
        │   ├── admin/
        │   │   ├── Dashboard.jsx
        │   │   ├── Products.jsx
        │   │   ├── Orders.jsx
        │   │   └── Users.jsx
        │   └── user/
        │       ├── Shop.jsx
        │       ├── Cart.jsx
        │       └── UserOrders.jsx
        └── utils/
            └── api.js           # Axios instance + interceptors
```

---

HTTP Request
  → Controller  (รับ/ตอบ HTTP)
      → Service (Business Logic + Validation)
          → AppDbContext (EF Core → SQLite)
```

### Controllers

| Controller          | Route                                                     | Auth                   | หน้าที่                                   |
| ------------------- | --------------------------------------------------------- | ---------------------- | ----------------------------------------- |
| AuthController      | `POST /api/auth/login` `POST /api/auth/register`          | ไม่ต้อง                | รับ credentials → เรียก AuthService       |
| ProductsController  | `GET/POST/PUT/PATCH/DELETE /api/products`                 | GET ทุกคน, แก้ไข admin | จัดการสินค้า                              |
| OrdersController    | `GET/POST /api/orders`                                    | ต้อง login             | user เห็นออเดอร์ตัวเอง, admin เห็นทั้งหมด |
| DashboardController | `GET /api/dashboard/stats` `GET /api/dashboard/low-stock` | admin เท่านั้น         | ข้อมูล dashboard                          |
| UsersController     | `GET/PUT /api/users`                                      | admin เท่านั้น         | จัดการ user                               |

### Services

| Service          | Business Rules สำคัญ                                           |
| ---------------- | -------------------------------------------------------------- |
| AuthService      | verify BCrypt, password ≥ 6 ตัว, ชื่อซ้ำ, สร้าง JWT อายุ 7 วัน |
| ProductService   | ราคา/สต็อกห้ามติดลบ, ลบเป็น soft delete (IsActive=false)       |
| OrderService     | quantity > 0, stock เพียงพอทุกรายการ, ตัดสต็อกอัตโนมัติ        |
| DashboardService | Top 5 สินค้าขายดี, threshold ห้ามติดลบ                         |
| UserService      | username ห้ามว่าง/ซ้ำ, role ต้องเป็น admin หรือ user เท่านั้น  |

---

## Frontend

### Routing & Auth Guard

```
/              → redirect ตาม role (admin → /admin, user → /shop)
/login         → Login.jsx
/admin/*       → RequireAuth(role=admin) → AdminLayout → outlet
  /admin             → Dashboard
  /admin/products    → Products
  /admin/orders      → Orders
  /admin/users       → Users
/shop/*        → RequireAuth → UserLayout → outlet
  /shop              → Shop
  /shop/cart         → Cart
  /shop/orders       → UserOrders
```





