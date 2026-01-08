# 🧪 Yummy Server - Automated Testing Documentation

## Tổng quan

Dự án Yummy Server sử dụng **Jest** và **Supertest** để thực hiện automated testing cho toàn bộ backend API.

## Cấu trúc Test

```
__tests__/
├── setup.js                          # Global test setup
├── helpers/
│   └── testHelpers.js               # Test utility functions
├── api/                             # API endpoint tests
│   ├── user.test.js                 # User API tests
│   ├── ai.test.js                   # AI API tests
│   └── food.test.js                 # Food API tests
└── integration/                     # Integration tests
    └── app.integration.test.js      # Full app flow tests
```

## Cài đặt Dependencies

### Sử dụng npm:
```bash
npm install --save-dev jest supertest @types/jest @types/supertest cross-env mongodb-memory-server
```

### Sử dụng yarn:
```bash
yarn add -D jest supertest @types/jest @types/supertest cross-env mongodb-memory-server
```

## Chạy Tests

### 1. Chạy tất cả tests:
```bash
npm test
# hoặc
yarn test
```

### 2. Chạy tests với watch mode (tự động rerun khi có thay đổi):
```bash
npm run test:watch
# hoặc
yarn test:watch
```

### 3. Chạy tests với coverage report:
```bash
npm run test:coverage
# hoặc
yarn test:coverage
```

### 4. Chạy specific test file:
```bash
# User tests
npm run test:user

# AI tests
npm run test:ai

# Food tests
npm run test:food
```

### 5. Chạy tests với verbose output:
```bash
npm run test:verbose
```

## Các loại Tests

### 📌 Unit Tests (API Tests)

#### **User API Tests** (`__tests__/api/user.test.js`)
- ✅ Registration validation
- ✅ Login authentication
- ✅ Password reset flow
- ✅ Email verification
- ✅ User CRUD operations

**Test coverage:**
- Valid registration
- Invalid input validation (short username, invalid email, weak password)
- Duplicate email prevention
- Login with correct/incorrect credentials
- Forgot password functionality
- Protected routes authentication

#### **AI API Tests** (`__tests__/api/ai.test.js`)
- ✅ Recipe suggestion generation
- ✅ Cooking question answering
- ✅ Input validation
- ✅ OpenAI service mocking

**Test coverage:**
- Recipe suggestions with various ingredients
- Cooking questions with conversation history
- Empty/invalid input handling
- Long text handling

#### **Food API Tests** (`__tests__/api/food.test.js`)
- ✅ Get all foods with pagination
- ✅ Search foods
- ✅ Get food details
- ✅ Get foods by category/user
- ✅ CRUD operations
- ✅ Authentication/authorization

**Test coverage:**
- Pagination functionality
- Search with various queries
- Food detail retrieval
- Category/user filtering
- Protected routes

### 🔗 Integration Tests (`__tests__/integration/app.integration.test.js`)

**Complete user journey:**
1. User registration
2. Email verification (simulated)
3. User login
4. Fetch users list
5. Create category
6. Create food
7. Search foods
8. Get food details
9. AI recipe suggestion
10. AI cooking question

**Error handling tests:**
- Authentication errors
- Validation errors
- Not found errors

**Data consistency tests:**
- Database relationships
- User-Food associations
- Category-Food associations

## Test Database Configuration

Test sử dụng database riêng biệt để đảm bảo không ảnh hưởng đến production data.

**File: `.env.test`**
```env
NODE_ENV=test
MONGO_URL=mongodb://localhost:27017/yummy_test
JWT_ACCESS_SECRET=test_jwt_secret
# ... other test configs
```

## Best Practices

### ✅ Isolation
- Mỗi test suite chạy độc lập
- Database được clear trước mỗi test
- Mock external services (OpenAI)

### ✅ Fast Execution
- Sử dụng in-memory database khi có thể
- Mock expensive operations
- Parallel test execution

### ✅ Comprehensive Coverage
- Test cả success và failure cases
- Validate input/output
- Test edge cases

### ✅ Readable Tests
- Descriptive test names
- Clear arrange-act-assert structure
- Helpful error messages

## Test Metrics

### Coverage Goals
- **Lines**: > 50%
- **Functions**: > 50%
- **Branches**: > 50%
- **Statements**: > 50%

### Current Test Count
- **User API**: 15+ tests
- **AI API**: 12+ tests
- **Food API**: 15+ tests
- **Integration**: 5+ comprehensive flows

**Total**: 47+ automated tests

## CI/CD Integration

Tests được thiết kế để chạy trong CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Troubleshooting

### ❌ MongoDB Connection Errors
**Solution:** Đảm bảo MongoDB đang chạy hoặc cài đặt `mongodb-memory-server`

### ❌ Jest Module Errors
**Solution:** Kiểm tra `jest.config.js` có đúng cấu hình ES modules

### ❌ Timeout Errors
**Solution:** Tăng timeout trong `jest.config.js`:
```javascript
testTimeout: 30000
```

### ❌ Port Already in Use
**Solution:** Tests không start server, chỉ test routes. Không cần worry về port conflicts.

## Test Data Generators

**Helper functions** (`__tests__/helpers/testHelpers.js`):
- `createTestUserData()` - Generate random user data
- `createTestFoodData()` - Generate random food data
- `generateTestEmail()` - Generate unique email
- `generateTestUsername()` - Generate unique username
- `extractToken()` - Extract JWT from response
- `connectTestDB()` - Connect to test database
- `clearTestDB()` - Clear all test data

## Kết luận

Automated testing framework này cung cấp:
- ✅ **Comprehensive coverage** của toàn bộ API
- ✅ **Fast feedback** khi phát triển
- ✅ **Regression prevention** khi refactor
- ✅ **Documentation** thông qua tests
- ✅ **CI/CD ready** cho deployment pipeline

## 📊 Test Results Example

```
PASS  __tests__/api/user.test.js
PASS  __tests__/api/ai.test.js
PASS  __tests__/api/food.test.js
PASS  __tests__/integration/app.integration.test.js

Test Suites: 4 passed, 4 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        12.5s
Coverage:    Lines: 65% | Functions: 58% | Branches: 52%
```

---

**Tác giả:** Yummy Development Team  
**Ngày cập nhật:** 2026-01-08  
**Version:** 1.0.0
