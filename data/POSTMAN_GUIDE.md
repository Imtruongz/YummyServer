# 🧪 Test API Popular Creators với Postman

## 📋 **THÔNG TIN CƠ BẢN**

### API Endpoint:
```
GET http://localhost:3000/api/users/popular-creators
```

### Yêu cầu:
- ✅ Cần **Authentication Token** (Bearer Token)
- ✅ Method: **GET**
- ✅ Query params (optional): `limit` (mặc định: 10)

---

## 🚀 **BƯỚC 1: LẤY ACCESS TOKEN**

### 1.1. Đăng nhập để lấy token

**Endpoint:**
```
POST http://localhost:3000/api/users/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**Response sẽ trả về:**
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "xxx-xxx-xxx",
    "username": "...",
    "email": "..."
  }
}
```

**❗ LƯU Ý:** Copy giá trị `accessToken` để dùng cho bước tiếp theo!

---

## 🔍 **BƯỚC 2: GỌI API POPULAR CREATORS**

### 2.1. Cấu hình Postman

**1. Tạo request mới:**
- Method: **GET**
- URL: `http://localhost:3000/api/users/popular-creators`

**2. Set Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```
*(Thay `YOUR_ACCESS_TOKEN_HERE` bằng token từ bước 1)*

**3. Query Params (Optional):**
```
limit = 10
```
*(Số lượng creators muốn lấy, mặc định là 10)*

**4. Nhấn Send!**

### 2.2. Response mẫu

**Thành công (200):**
```json
[
  {
    "_id": "6960ccf8139b6c55e23e6895",
    "userId": "fe0c54f1-92ce-4d0e-9f63-33c6206495a9",
    "username": "Chef John",
    "avatar": "https://example.com/avatar.jpg",
    "description": "Food blogger and chef",
    "createdAt": "2026-01-09T09:40:08.313Z",
    "followerCount": 5
  },
  {
    "_id": "6960ccf8139b6c55e23e6896",
    "userId": "ea12f415-38bc-4825-ae5a-c0c3b487c112",
    "username": "Maria",
    "avatar": "https://example.com/avatar2.jpg",
    "description": "Home cook",
    "createdAt": "2026-01-08T09:40:08.313Z",
    "followerCount": 3
  }
]
```

**Lỗi 401 (Unauthorized):**
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**Lỗi 500 (Server Error):**
```json
{
  "message": "Lỗi máy chủ"
}
```

---

## 🐛 **BƯỚC 3: TROUBLESHOOTING**

### ❌ Nếu trả về mảng rỗng `[]`

**Nguyên nhân:** Không có user nào có followers

**Giải pháp:** Cần tạo follow relationships trước:

#### A. Kiểm tra users hiện có:
```
GET http://localhost:3000/api/users/getAll
Headers: Authorization: Bearer YOUR_TOKEN
```

#### B. Tạo follow relationship:
```
POST http://localhost:3000/api/follow/follow
Headers: 
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN
Body:
{
  "followingId": "USER_ID_TO_FOLLOW"
}
```

#### C. Kiểm tra lại popular creators:
```
GET http://localhost:3000/api/users/popular-creators
```

---

## 📝 **POSTMAN COLLECTION REFERENCE**

### Collection cơ bản:

```
Yummy API
├── Auth
│   ├── Login
│   └── Register
├── Users
│   ├── Get All Users
│   ├── Get Popular Creators ⭐
│   └── Get User By ID
└── Follow
    ├── Follow User
    ├── Unfollow User
    └── Get Followers
```

---

## 🎯 **TIP: Kiểm tra Database**

Nếu cần kiểm tra trực tiếp trong DB:

```bash
# Trong YummyServer directory
node scripts/checkFoods.js   # Kiểm tra foods
node scripts/checkConnection.js   # Kiểm tra toàn bộ DB
```

---

## 📞 **LIÊN HỆ**

Nếu gặp vấn đề:
1. Kiểm tra server đang chạy: `yarn dev`
2. Kiểm tra MongoDB connection
3. Kiểm tra token còn hạn không
4. Kiểm tra có user nào có followers không

**Server Info:**
- Port: `3000` (hoặc theo `.env`)
- Base URL: `http://localhost:3000/api`
- Database: `Yummy`

---

**Created:** 2026-01-09  
**Version:** 1.0
