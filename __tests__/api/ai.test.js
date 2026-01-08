import request from 'supertest';
import express from 'express';
import aiRouter from '../../Routers/aiRouter.js';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/ai', aiRouter);

/**
 * 🤖 KIỂM THỬ API AI
 * Test validation cho AI suggestions và cooking questions
 */
describe('AI API Tests', () => {

    /**
     * 🍳 NHÓM TEST: GỢI Ý CÔNG THỨC NẤU ĂN
     * Kiểm tra validation input cho recipe suggestions
     */
    describe('POST /api/ai/suggest-recipe - Recipe Suggestion', () => {

        // ❌ Test validation: Từ chối request thiếu ingredients
        it('should reject request with missing ingredients', async () => {
            const response = await request(app)
                .post('/api/ai/suggest-recipe')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('ingredients');
        });

        // ❌ Test validation: Từ chối ingredients array rỗng
        it('should reject request with empty ingredients array', async () => {
            const response = await request(app)
                .post('/api/ai/suggest-recipe')
                .send({ ingredients: [] })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });

        // ❌ Test validation: Từ chối ingredients không phải array
        it('should reject request with non-array ingredients', async () => {
            const response = await request(app)
                .post('/api/ai/suggest-recipe')
                .send({ ingredients: 'not an array' })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });
    });

    /**
     * 💬 NHÓM TEST: HỎI ĐÁP NẤU ĂN
     * Kiểm tra validation input cho cooking questions
     */
    describe('POST /api/ai/ask-question - Cooking Question', () => {

        // ❌ Test validation: Từ chối request thiếu question
        it('should reject request with missing question', async () => {
            const response = await request(app)
                .post('/api/ai/ask-question')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('question');
        });

        // ❌ Test validation: Từ chối question không phải string
        it('should reject request with non-string question', async () => {
            const response = await request(app)
                .post('/api/ai/ask-question')
                .send({ question: 123 })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });

        // ❌ Test validation: Từ chối empty string question
        it('should reject request with empty string question', async () => {
            const response = await request(app)
                .post('/api/ai/ask-question')
                .send({ question: '' })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });
    });
});
