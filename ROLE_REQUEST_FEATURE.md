# Role Request Feature

## Tổng quan
Tính năng Role Request cho phép người dùng yêu cầu các role đặc biệt (Vet và Shelter) thông qua giao diện web.

## Cách sử dụng

### 1. Truy cập trang Role Request
- Đăng nhập vào hệ thống
- Vào trang "My Account" 
- Click vào tab "Role Request"

### 2. Tạo yêu cầu role mới
- Chọn role bạn muốn yêu cầu:
  - **Vet (Bác sĩ thú y)**: Để cung cấp dịch vụ y tế cho thú cưng
  - **Shelter (Trại cứu hộ)**: Để quản lý trại cứu hộ động vật
- Nhập lý do yêu cầu (bắt buộc)
- Click "Gửi yêu cầu"

### 3. Xem lịch sử yêu cầu
- Click "Xem lịch sử" để xem các yêu cầu đã gửi
- Các trạng thái có thể có:
  - **Đang chờ**: Yêu cầu đang được admin xem xét
  - **Đã duyệt**: Yêu cầu được chấp nhận
  - **Từ chối**: Yêu cầu bị từ chối

## API Endpoints

### Frontend API (merier/src/api/user.js)
```javascript
// Tạo role request mới
createRoleRequest(data) // POST /v1/user/role-requests

// Lấy danh sách role requests của user hiện tại
getUserRoleRequests() // GET /v1/user/role-requests/user
```

### Backend API (user-service)
```java
// Tạo role request
POST /v1/user/role-requests
Body: { "role": "VET|SHELTER", "reason": "string" }

// Lấy role requests của user
GET /v1/user/role-requests/user

// Admin endpoints
GET /v1/user/role-requests/pending
POST /v1/user/role-requests/{requestId}/approve
POST /v1/user/role-requests/{requestId}/reject
```

## Cấu trúc dữ liệu

### RoleRequestRequest
```java
{
    "role": "VET|SHELTER",
    "reason": "Lý do yêu cầu"
}
```

### RoleRequestResponse
```java
{
    "id": "uuid",
    "userId": "user-id",
    "requestedRole": "VET|SHELTER",
    "reason": "Lý do yêu cầu",
    "status": "PENDING|APPROVED|REJECTED",
    "creationTimestamp": "2024-01-01T00:00:00",
    "adminNote": "Ghi chú của admin"
}
```

## Luồng xử lý

1. **User tạo request**: User điền form và gửi yêu cầu
2. **Lưu vào database**: Request được lưu với status PENDING
3. **Admin xem xét**: Admin có thể xem danh sách pending requests
4. **Admin quyết định**: 
   - Approve: Cập nhật role cho user
   - Reject: Từ chối với lý do
5. **Thông báo kết quả**: User có thể xem kết quả trong lịch sử

## Files đã tạo/cập nhật

### Frontend
- `merier/src/components/client/userPage/RoleRequestForm.jsx` - Component chính
- `merier/src/components/client/userPage/RoleRequestForm.css` - Styles
- `merier/src/api/user.js` - API functions
- `merier/src/components/client/userPage/User.jsx` - Tích hợp tab mới

### Backend
- `user-service/src/main/java/com/example/userservice/controller/UserController.java` - Thêm endpoint
- `user-service/src/main/java/com/example/userservice/request/RoleRequestResponse.java` - Cập nhật response
- `user-service/src/main/java/com/example/userservice/service/UserService.java` - Thêm method
- `user-service/src/main/java/com/example/userservice/service/UserServiceImpl.java` - Implementation

## Lưu ý
- Chỉ user đã đăng nhập mới có thể tạo role request
- Mỗi user có thể có nhiều role requests
- Admin cần có role ADMIN để xem xét requests
- Role requests được lưu vĩnh viễn để theo dõi lịch sử
