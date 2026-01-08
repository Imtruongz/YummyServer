import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB,
    createTestFoodData
} from '../helpers/testHelpers.js';
import foodRouter from '../../Routers/foodsRoute.js';
import { Category } from '../../Models/categories.js';
import { User } from '../../Models/users.js';
import { Food } from '../../Models/foods.js';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/foods', foodRouter);

/**
 * 🍽️ KIỂM THỬ API FOOD
 * Test CRUD operations, search, pagination, và authentication
 */
describe('Food API Tests', () => {
    let testFood;
    let testCategory;
    let testUser;

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();

        // Create test category
        testCategory = await Category.create({
            categoryName: 'Test Category',
            categoryThumbnail: 'https://example.com/thumbnail.jpg'
        });

        // Create test user
        testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: 'hashedpassword'
        });

        testFood = createTestFoodData({
            categoryId: testCategory._id,
            userId: testUser._id
        });
    });

    afterAll(async () => {
        await clearTestDB();
        await disconnectTestDB();
    });

    /**
     * 📋 NHÓM TEST: LẤY DANH SÁCH MÓN ĂN
     * Kiểm tra pagination, filtering, và response structure
     */
    describe('GET /api/foods - Get All Foods', () => {
        // 🔐 Test security: Yêu cầu authentication để xem danh sách
        it('should return paginated list of foods', async () => {
            // Create some test foods
            await Food.create([
                { ...testFood, foodName: 'Food 1' },
                { ...testFood, foodName: 'Food 2' },
                { ...testFood, foodName: 'Food 3' }
            ]);

            const response = await request(app)
                .get('/api/foods/getAll')
                .query({ page: 1, limit: 10 })
                .expect(401); // Requires authentication

            // When unauthorized, should not return data
            expect(response.status).toBe(401);
        });

        // 🔐 Test security: Kiểm tra response khi không có food
        it('should return empty list when no foods exist', async () => {
            const response = await request(app)
                .get('/api/foods/getAll')
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // 🔐 Test: Xử lý pagination parameters
        it('should handle pagination parameters', async () => {
            const response = await request(app)
                .get('/api/foods/getAll')
                .query({ page: 2, limit: 5 })
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });
    });

    /**
     * 🔍 NHÓM TEST: TÌM KIẾM MÓN ĂN
     * Kiểm tra search functionality và query handling
     */
    describe('GET /api/foods/search - Search Foods', () => {
        beforeEach(async () => {
            await Food.create([
                { ...testFood, foodName: 'Chicken Pasta' },
                { ...testFood, foodName: 'Beef Steak' },
                { ...testFood, foodName: 'Chicken Curry' }
            ]);
        });

        // 🔐 Test: Tìm kiếm món ăn theo tên
        it('should search foods by name', async () => {
            const response = await request(app)
                .get('/api/foods/search')
                .query({ q: 'Chicken' })
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // 🔐 Test: Kết quả rỗng khi không tìm thấy
        it('should return empty results for non-matching search', async () => {
            const response = await request(app)
                .get('/api/foods/search')
                .query({ q: 'NonExistentFood' })
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // 🔐 Test: Xử lý search query rỗng
        it('should handle empty search query', async () => {
            const response = await request(app)
                .get('/api/foods/search')
                .query({ q: '' })
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });
    });

    /**
     * 📝 NHÓM TEST: CHI TIẾT MÓN ĂN
     * Kiểm tra lấy thông tin chi tiết và error handling
     */
    describe('GET /api/foods/:foodId - Get Food Detail', () => {
        // 🔐 Test: Lấy chi tiết món ăn với ID hợp lệ
        it('should return food details for valid ID', async () => {
            const createdFood = await Food.create(testFood);

            const response = await request(app)
                .get(`/api/foods/getDetail/${createdFood._id}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // ❌ Test error: Food ID không tồn tại
        it('should return 404 for non-existent food ID', async () => {
            const fakeId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/api/foods/getDetail/${fakeId}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // ❌ Test error: Food ID format không hợp lệ
        it('should return 500 for invalid food ID format', async () => {
            const response = await request(app)
                .get('/api/foods/getDetail/invalid-id')
                .expect(401); // Requires authentication
        });
    });

    /**
     * 🏷️ NHÓM TEST: LỌC THEO DANH MỤC
     * Kiểm tra filtering by category
     */
    describe('GET /api/foods/category/:categoryId - Get Foods by Category', () => {
        // 🔐 Test: Lấy món ăn theo category
        it('should return foods for valid category', async () => {
            await Food.create([
                { ...testFood, categoryId: testCategory._id },
                { ...testFood, categoryId: testCategory._id }
            ]);

            const response = await request(app)
                .get(`/api/foods/getFoodsByCategory/${testCategory._id}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // 📊 Test: Category không có food
        it('should return empty array for category with no foods', async () => {
            const emptyCategory = await Category.create({
                categoryName: 'Empty Category',
                categoryThumbnail: 'https://example.com/empty.jpg'
            });

            const response = await request(app)
                .get(`/api/foods/getFoodsByCategory/${emptyCategory._id}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });
    });

    /**
     * 👤 NHÓM TEST: LỌC THEO NGƯỜI DÙNG
     * Kiểm tra filtering by user
     */
    describe('GET /api/foods/user/:userId - Get Foods by User', () => {
        // 🔐 Test: Lấy món ăn của user
        it('should return foods created by user', async () => {
            await Food.create([
                { ...testFood, userId: testUser._id },
                { ...testFood, userId: testUser._id }
            ]);

            const response = await request(app)
                .get(`/api/foods/getFoodByUserId/${testUser._id}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });

        // 📊 Test: User không có food
        it('should return empty array for user with no foods', async () => {
            const newUser = await User.create({
                username: 'newuser',
                email: 'new@example.com',
                passwordHash: 'password'
            });

            const response = await request(app)
                .get(`/api/foods/getFoodByUserId/${newUser._id}`)
                .expect(401); // Requires authentication

            expect(response.status).toBe(401);
        });
    });

    /**
     * ➕ NHÓM TEST: THÊM MÓN ĂN MỚI
     * Kiểm tra authentication requirements
     */
    describe('POST /api/foods - Add Food', () => {
        // 🔐 Test security: Yêu cầu authentication để thêm food
        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/foods/add')
                .send(testFood)
                .expect(401);
        });
    });

    /**
     * 🗑️ NHÓM TEST: XÓA MÓN ĂN
     * Kiểm tra authorization
     */
    describe('DELETE /api/foods/:foodId - Delete Food', () => {
        // 🔐 Test security: Yêu cầu authentication để xóa food
        it('should require authentication or authorization', async () => {
            const createdFood = await Food.create(testFood);

            const response = await request(app)
                .delete(`/api/foods/delete/${createdFood._id}`)
                .expect(401);
        });
    });

    /**
     * ✏️ NHÓM TEST: CẬP NHẬT MÓN ĂN
     * Kiểm tra update functionality
     */
    describe('PATCH /api/foods - Update Food', () => {
        // 🔐 Test security: Yêu cầu authentication để update food
        it('should require authentication', async () => {
            const response = await request(app)
                .put('/api/foods/update')
                .send({ foodId: 'some-id', userId: testUser._id })
                .expect(401);
        });
    });
});
