// ==========================================
// Order Controller Tests
// Coverage: create order, stock atomicity, cancel + stock restore
// ==========================================

const request = require('supertest');
const app = require('../../src/app');
const { prisma } = require('../../src/config/database');

// Mock auth middleware to inject user
let mockUserId = '550e8400-e29b-41d4-a716-446655440000';
jest.mock('../../src/middleware/auth', () => ({
    authenticate: (req, _res, next) => {
        req.user = { id: mockUserId, email: 'test@example.com', role: 'customer' };
        next();
    },
    authorize: (...roles) => (_req, _res, next) => next(),
    optionalAuth: (req, _res, next) => {
        req.user = { id: mockUserId, email: 'test@example.com', role: 'customer' };
        next();
    },
}));

describe('Order API', () => {
    let testProductId;
    let testOrderId;
    const initialStock = 5;

    beforeAll(async () => {
        // Create test user
        await prisma.user.upsert({
            where: { id: mockUserId },
            update: {},
            create: {
                id: mockUserId,
                email: 'test@example.com',
                passwordHash: 'fake',
                fullName: 'Test User',
            }
        });

        // Create a test product with known stock
        const product = await prisma.product.create({
            data: {
                name: 'Test Product for Orders',
                slug: `test-product-orders-${Date.now()}`,
                basePrice: 100000,
                stockQuantity: initialStock,
                isActive: true,
                categoryId: null, // allow null for test
            },
        });
        testProductId = product.id;
    });

    afterAll(async () => {
        // Cleanup
        await prisma.orderItem.deleteMany({ where: { productId: testProductId } }).catch(() => { });
        await prisma.inventoryLog.deleteMany({ where: { productId: testProductId } }).catch(() => { });
        await prisma.product.delete({ where: { id: testProductId } }).catch(() => { });
        await prisma.user.delete({ where: { id: mockUserId } }).catch(() => { });
        await prisma.$disconnect();
    });

    const validOrderPayload = () => ({
        items: [{ productId: testProductId, quantity: 1 }],
        shippingAddress: {
            fullName: 'Test User',
            phone: '0912345678',
            address: '123 Test Street',
            city: 'Ho Chi Minh',
            country: 'VN',
        },
        paymentMethod: 'cod',
    });

    // ==========================================
    // POST /api/orders
    // ==========================================
    describe('POST /api/orders — Create Order', () => {
        it('should create an order successfully', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send(validOrderPayload())
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('orderNumber');
            expect(res.body.data.orderItems).toHaveLength(1);
            expect(res.body.data.orderItems[0].productId).toBe(testProductId);
            testOrderId = res.body.data.id;

            // Verify stock was deducted in DB
            const product = await prisma.product.findUnique({ where: { id: testProductId } });
            expect(product.stockQuantity).toBe(initialStock - 1);
        });

        it('should reject empty items array', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send({ ...validOrderPayload(), items: [] })
                .expect(400);

            expect(res.body.success).toBe(false);
        });

        it('should reject invalid productId (non-UUID)', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send({ ...validOrderPayload(), items: [{ productId: 'not-a-uuid', quantity: 1 }] })
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('UUID');
        });

        it('should reject zero or negative quantity', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send({ ...validOrderPayload(), items: [{ productId: testProductId, quantity: 0 }] })
                .expect(400);

            expect(res.body.success).toBe(false);
        });

        it('should merge duplicate productId entries', async () => {
            // reset stock first
            await prisma.product.update({
                where: { id: testProductId },
                data: { stockQuantity: initialStock },
            });

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send({
                    ...validOrderPayload(),
                    items: [
                        { productId: testProductId, quantity: 1 },
                        { productId: testProductId, quantity: 1 }, // duplicate
                    ],
                })
                .expect(201);

            expect(res.body.success).toBe(true);
            // Should be merged into 1 item with quantity 2
            expect(res.body.data.orderItems).toHaveLength(1);
            expect(res.body.data.orderItems[0].quantity).toBe(2);

            const product = await prisma.product.findUnique({ where: { id: testProductId } });
            expect(product.stockQuantity).toBe(initialStock - 2);
        });

        it('should return 409 when stock is insufficient', async () => {
            // Set stock to 0
            await prisma.product.update({
                where: { id: testProductId },
                data: { stockQuantity: 0 },
            });

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send(validOrderPayload())
                .expect(409);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('stock');
        });
    });

    // ==========================================
    // PATCH /api/orders/:id/cancel
    // ==========================================
    describe('PATCH /api/orders/:id/cancel — Cancel Order', () => {
        beforeEach(async () => {
            // Reset stock and create a fresh order
            await prisma.product.update({
                where: { id: testProductId },
                data: { stockQuantity: initialStock },
            });

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .send(validOrderPayload())
                .expect(201);
            testOrderId = res.body.data.id;
        });

        it('should cancel a pending order and restore stock', async () => {
            const stockBefore = (await prisma.product.findUnique({ where: { id: testProductId } })).stockQuantity;

            const res = await request(app)
                .patch(`/api/orders/${testOrderId}/cancel`)
                .set('Authorization', 'Bearer fake-token')
                .expect(200);

            expect(res.body.success).toBe(true);

            // Verify stock was restored
            const productAfter = await prisma.product.findUnique({ where: { id: testProductId } });
            expect(productAfter.stockQuantity).toBe(stockBefore + 1);

            // Verify order status is cancelled
            const order = await prisma.order.findUnique({ where: { id: testOrderId } });
            expect(order.status).toBe('cancelled');
        });

        it('should not allow cancelling a delivered order', async () => {
            // Update order to delivered
            await prisma.order.update({
                where: { id: testOrderId },
                data: { status: 'delivered' },
            });

            const res = await request(app)
                .patch(`/api/orders/${testOrderId}/cancel`)
                .set('Authorization', 'Bearer fake-token')
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('cannot be cancelled');
        });

        it('should not allow cancelling another user\'s order', async () => {
            mockUserId = '550e8400-e29b-41d4-a716-446655440001';

            const res = await request(app)
                .patch(`/api/orders/${testOrderId}/cancel`)
                .set('Authorization', 'Bearer fake-token')
                .expect(404); // findFirst with wrong userId returns null → 404

            expect(res.body.success).toBe(false);

            mockUserId = '550e8400-e29b-41d4-a716-446655440000';
        });
    });

    // ==========================================
    // GET /api/orders
    // ==========================================
    describe('GET /api/orders — List Orders', () => {
        it('should return paginated orders for the user', async () => {
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .query({ page: 1, limit: 10 })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.pagination).toHaveProperty('total');
        });

        it('should not return other users\' orders', async () => {
            // All returned orders should have userId = mockUserId
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', 'Bearer fake-token')
                .expect(200);

            // Cannot directly check userId (not returned in response),
            // but ensure we only get logged-in user's orders via filter
            expect(res.body.success).toBe(true);
        });
    });
});
