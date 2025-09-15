import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true,
    allowedHosts: ["ctrlcv.techwiz6.cusc.vn"], // 👈 thêm dòng này
    proxy: {
      '/v1': 'http://localhost:8080',
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['swiper', 'framer-motion', 'react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  css: {
    devSourcemap: true,
  },
})




# MERIER - Ứng dụng E-commerce Frontend

## Tổng quan dự án

Merier là một ứng dụng e-commerce frontend được xây dựng bằng React và Vite, kết nối với hệ thống microservice backend để cung cấp trải nghiệm mua sắm trực tuyến hoàn chỉnh.

## Công nghệ sử dụng

### Frontend Framework
- **React 18.3.1** - Thư viện UI chính
- **Vite 7.0.4** - Build tool và dev server
- **React Router DOM 6.20.0** - Routing cho SPA

### UI/UX Libraries
- **Bootstrap 5.3.2** - CSS framework
- **React Bootstrap 2.9.0** - React components cho Bootstrap
- **Swiper 11.2.10** - Carousel/slider component
- **React Hook Form 7.48.2** - Form handling
- **React Hot Toast 2.4.1** - Notification system

### State Management & Data Fetching
- **TanStack React Query 5.8.4** - Server state management
- **Axios 1.6.0** - HTTP client
- **Context API** - Local state management

### Authentication & Security
- **js-cookie 3.0.5** - Cookie management
- **JWT Token** - Authentication

## Cấu trúc dự án

```
merier/
├── public/                 # Static assets
├── src/
│   ├── api/               # API services
│   │   ├── auth.js        # Authentication API
│   │   ├── user.js        # User management API
│   │   ├── product.js     # Product API
│   │   └── createApiInstance.js # Axios configuration
│   ├── assets/            # Static resources
│   │   ├── css/          # Stylesheets
│   │   ├── images/       # Images
│   │   └── js/           # JavaScript libraries
│   ├── components/        # Reusable components
│   │   ├── client/       # Client-side components
│   │   └── admin/        # Admin components
│   ├── contexts/         # React Context
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   │   └── client/       # Client pages
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md
```

## Các chức năng chính

### 1. Authentication & Authorization
- **Đăng nhập/Đăng ký** - Hỗ trợ email/password và Google OAuth
- **Quên mật khẩu** - Gửi OTP qua email
- **Xác thực OTP** - Xác minh mã OTP
- **Đặt lại mật khẩu** - Cập nhật mật khẩu mới
- **JWT Token Management** - Tự động refresh token

### 2. User Management
- **Thông tin cá nhân** - Xem và cập nhật profile
- **Quản lý địa chỉ** - Thêm, sửa, xóa địa chỉ giao hàng
- **Đặt địa chỉ mặc định** - Chọn địa chỉ giao hàng chính

### 3. Product Management
- **Danh sách sản phẩm** - Hiển thị tất cả sản phẩm
- **Tìm kiếm sản phẩm** - Tìm kiếm theo tên, danh mục
- **Chi tiết sản phẩm** - Xem thông tin chi tiết
- **Hình ảnh sản phẩm** - Hiển thị ảnh từ file storage

### 4. Shopping Cart
- **Thêm vào giỏ hàng** - Thêm sản phẩm vào cart
- **Xem giỏ hàng** - Hiển thị danh sách sản phẩm đã chọn
- **Cập nhật số lượng** - Tăng/giảm số lượng sản phẩm
- **Xóa sản phẩm** - Loại bỏ sản phẩm khỏi giỏ

### 5. Order Management
- **Tạo đơn hàng** - Đặt hàng từ giỏ hàng
- **Theo dõi đơn hàng** - Xem trạng thái đơn hàng
- **Lịch sử đơn hàng** - Xem các đơn hàng đã đặt

## API Integration

### Base Configuration
```javascript
// createApiInstance.js
const api = axios.create({
    baseURL: '/v1', // Gateway endpoint
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auto token injection
api.interceptors.request.use((config) => {
    const token = Cookies.get("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Authentication API
```javascript
// auth.js
export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    const { token } = response.data;
    Cookies.set("accessToken", token, { expires: 7 });
    return response.data;
};

export const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const forgotPassword = (email) =>
    api.post("/auth/forgotPassword", { email });

export const verifyOtp = (email, otp) =>
    api.post("/auth/verifyOtp", { email, otp });
```

### User Management API
```javascript
// user.js
export const getUser = async () => {
    const response = await api.get("/user/information");
    return response.data;
};

export const getCart = async () => {
    const response = await api.get("/user/cart");
    return response.data;
};

export const createAddress = async (data) => {
    const response = await api.post("/user/address/save", data);
    return response.data;
};

export const getAllAddress = async () => {
    const response = await api.get("/user/address/getAllAddresses");
    return response.data;
};
```

### Product API
```javascript
// product.js
export const fetchProducts = (params = {}) => {
    return api.get("/stock/product/list", { params });
};

export const fetchProductById = (productId) => {
    return api.get(`/stock/product/getProductById/${productId}`);
};

export const fetchProductImageById = (imageId) => {
    return api.get(`/file-storage/get/${imageId}`, {
        responseType: "arraybuffer",
    });
};

export const fetchAddToCart = async (data) => {
    const response = await api.post(`/stock/cart/item/add`, data);
    return response.data;
};
```

## Cách chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd merier

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

### Cấu hình
1. Đảm bảo backend microservice đang chạy
2. Cấu hình proxy trong `vite.config.js` nếu cần
3. Cập nhật API endpoints trong các file API

## Cấu trúc JSON Response từ Backend

### Authentication Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "username": "username",
    "roles": ["ROLE_USER"]
  }
}
```

### User Information Response
```json
{
  "id": "user123",
  "email": "user@example.com",
  "username": "username",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "addresses": [
    {
      "id": "addr1",
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận 1, TP.HCM",
      "isDefault": true
    }
  ]
}
```

### Product List Response
```json
{
  "content": [
    {
      "id": "prod1",
      "name": "iPhone 15 Pro",
      "description": "Latest iPhone model",
      "price": 29990000,
      "discountPrice": 27990000,
      "category": {
        "id": "cat1",
        "name": "Điện thoại"
      },
      "images": [
        {
          "id": "img1",
          "url": "/file-storage/get/img1"
        }
      ],
      "stock": 50
    }
  ],
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```

### Cart Response
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": {
        "id": "prod1",
        "name": "iPhone 15 Pro",
        "price": 29990000,
        "images": ["img1"]
      },
      "quantity": 2,
      "subtotal": 59980000
    }
  ],
  "totalAmount": 59980000,
  "totalItems": 2
}
```

## Routing Structure

```javascript
// App.jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<AuthPage />} />
  <Route path="/register" element={<AuthPage />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/information/*" element={<UserPage />} />
  <Route path="/shop" element={<ShopPage />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/oauth2/callback" element={<GoogleCallback />} />
  <Route path="/forgot" element={<ForgotPasswordPage />} />
  <Route path="/verify-otp" element={<VerifyOtpPage />} />
  <Route path="/reset-password" element={<ResetPasswordPage />} />
</Routes>
```

## State Management

### Context API Usage
- **CartContext** - Quản lý giỏ hàng
- **AuthContext** - Quản lý authentication state

### React Query
- Cache API responses
- Background refetching
- Optimistic updates
- Error handling

## Security Features

1. **JWT Token Management**
   - Auto token injection
   - Token expiration handling
   - Auto logout on 401

2. **Route Protection**
   - Protected routes cho authenticated users
   - Role-based access control

3. **Input Validation**
   - Form validation với React Hook Form
   - Server-side validation feedback

## Performance Optimizations

1. **Code Splitting** - Lazy loading components
2. **Image Optimization** - Lazy loading images
3. **API Caching** - React Query caching
4. **Bundle Optimization** - Vite build optimization

## Development Guidelines

### Code Structure
- Components trong thư mục `components/`
- Pages trong thư mục `pages/`
- API calls trong thư mục `api/`
- Utilities trong thư mục `utils/`

### Naming Conventions
- Components: PascalCase (UserPage.jsx)
- Functions: camelCase (getUserData)
- Constants: UPPER_SNAKE_CASE (API_URL)
- Files: PascalCase cho components, camelCase cho utilities

### Error Handling
- Try-catch blocks cho API calls
- Error boundaries cho React components
- Toast notifications cho user feedback

## Troubleshooting

### Common Issues
1. **CORS Error** - Kiểm tra backend CORS configuration
2. **Token Expired** - Check token expiration và refresh logic
3. **API Connection** - Verify backend services đang chạy
4. **Build Errors** - Check dependencies và Node.js version

### Debug Tools
- React Developer Tools
- Network tab trong browser
- Console logs cho API calls
- Vite dev server logs
