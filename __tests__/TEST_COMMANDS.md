# 🚀 Quick Test Commands - Yummy Server

## Installation (Chạy lần đầu)

```bash
# Sử dụng npm
npm install

# Hoặc yarn
yarn install
```

## Run Tests

### 📝 Basic Commands

```bash
# Chạy tất cả tests
npm test

# Chạy tests và watch (auto-rerun khi có thay đổi)
npm run test:watch

# Chạy tests với coverage report
npm run test:coverage

# Chạy tests với verbose output (chi tiết hơn)
npm run test:verbose
```

### 🎯 Specific Test Files

```bash
# Chỉ chạy User API tests
npm run test:user

# Chỉ chạy AI API tests
npm run test:ai

# Chỉ chạy Food API tests
npm run test:food
```

### 🔍 Advanced Commands

```bash
# Chạy test với pattern matching
npx jest user

# Chạy chỉ một test case cụ thể (thêm .only vào test)
# it.only('should do something', ...)
npm test

# Skip một test case (thêm .skip vào test)
# it.skip('should do something', ...)
npm test

# Chạy test với timeout dài hơn
npx jest --testTimeout=60000
```

## Coverage Reports

```bash
# Xem coverage trong terminal
npm run test:coverage

# View HTML coverage report (sau khi chạy test:coverage)
open coverage/lcov-report/index.html
```

## Debug Tests

```bash
# Debug với Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Chạy tests một cách tuần tự (không parallel)
npx jest --runInBand

# Chỉ chạy failed tests
npx jest --onlyFailures
```

## Before Running Tests

### 1. Đảm bảo MongoDB đang chạy
```bash
# Check MongoDB status
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
```

### 2. Kiểm tra file .env.test
```bash
# File .env.test phải tồn tại với config:
cat .env.test
```

## Expected Output

### ✅ Successful Test Run
```
 PASS  __tests__/api/user.test.js (12.5s)
 PASS  __tests__/api/ai.test.js (8.2s)
 PASS  __tests__/api/food.test.js (10.3s)
 PASS  __tests__/integration/app.integration.test.js (15.7s)

Test Suites: 4 passed, 4 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        47.2s
```

### ❌ Failed Test Example
```
 FAIL  __tests__/api/user.test.js
  ● User API Tests › POST /api/users/register › should reject short password

    expect(received).toContain(expected)

    Expected substring: "ít nhất 6 ký tự"
    Received: "Password is required"

      42 |         .expect(400);
      43 | 
    > 44 |       expect(response.body.message).toContain('ít nhất 6 ký tự');
         |                                      ^
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Tips & Tricks

### 💡 Tip 1: Watch Mode cho Development
```bash
# Tự động chạy lại tests khi code thay đổi
npm run test:watch
```

### 💡 Tip 2: Focus vào Tests quan trọng
```javascript
// Trong test file, sử dụng .only
describe.only('User API Tests', () => {
  // Chỉ test suite này sẽ chạy
});
```

### 💡 Tip 3: Skip Slow Tests
```javascript
// Skip tests chạy chậm khi develop
it.skip('should handle large file upload', () => {
  // Test này sẽ bị skip
});
```

### 💡 Tip 4: Clear Test Database
```bash
# Nếu cần xóa test database thủ công
mongo yummy_test --eval "db.dropDatabase()"
```

## Common Issues & Solutions

### Issue 1: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: "MongoDB connection timeout"
```bash
# Solution: Start MongoDB
brew services start mongodb-community
# hoặc check MONGO_URL trong .env.test
```

### Issue 3: "Port already in use"
```bash
# Solution: Tests không start server, check xem dev server có đang chạy
# Kill dev server nếu cần:
pkill -f "node.*server.js"
```

### Issue 4: "Jest encountered an unexpected token"
```bash
# Solution: Check jest.config.js có đúng:
# extensionsToTreatAsEsm: ['.js']
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Chạy tất cả tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:user` | User API tests only |
| `npm run test:ai` | AI API tests only |
| `npm run test:food` | Food API tests only |

---

**Pro Tip:** Luôn chạy `npm test` trước khi commit code! ✅
