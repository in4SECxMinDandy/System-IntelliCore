// ==========================================
// Zod Input Validation Middleware (Phase 1.1)
// Replaces scattered express-validator usage with 
// a unified, type-safe validation layer
// ==========================================

const { z } = require('zod');

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * Sets req.validated with parsed & sanitized data.
 * Returns 422 on validation failure with structured error messages.
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }
    req.validated = result.data; // overwrite with sanitized data
    next();
};

/**
 * Validates query params against a Zod schema.
 */
const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        const errors = result.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(422).json({
            success: false,
            message: 'Invalid query parameters',
            errors,
        });
    }
    req.validatedQuery = result.data;
    next();
};

// ==========================================
// Reusable Zod Schemas
// ==========================================

const uuidSchema = z.string().uuid('Must be a valid UUID');
const emailSchema = z.string().email('Invalid email address').toLowerCase().trim();
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Auth Schemas
const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    fullName: z.string().trim().min(1).max(255).optional(),
    phone: z.string().trim().max(20).optional(),
});

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
    email: emailSchema,
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    email: emailSchema,
    newPassword: passwordSchema,
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});

// Order Schemas
const orderItemSchema = z.object({
    productId: uuidSchema,
    variantId: uuidSchema.optional(),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(1000),
});

const shippingAddressSchema = z.object({
    fullName: z.string().trim().min(1).max(255),
    phone: z.string().trim().min(6).max(20),
    address: z.string().trim().min(1),
    city: z.string().trim().min(1).max(100),
    province: z.string().trim().max(100).optional(),
    district: z.string().trim().max(100).optional(),
    ward: z.string().trim().max(100).optional(),
    country: z.string().trim().length(2, 'Country must be 2-letter ISO code').default('VN'),
    zipCode: z.string().trim().max(20).optional(),
});

const createOrderSchema = z.object({
    items: z
        .array(orderItemSchema)
        .min(1, 'Order must have at least one item')
        .max(50, 'Too many items in one order'),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['cod', 'stripe', 'paypal', 'bank_transfer']),
    couponCode: z.string().trim().toUpperCase().max(50).optional(),
    notes: z.string().trim().max(500).optional(),
});

// Review Schemas
const createReviewSchema = z.object({
    productId: uuidSchema,
    orderId: uuidSchema.optional(),
    rating: z.number().int().min(1).max(5),
    buildQuality: z.number().int().min(1).max(5).optional(),
    deliverySpeed: z.number().int().min(1).max(5).optional(),
    valueForMoney: z.number().int().min(1).max(5).optional(),
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(5000).optional(),
});

// Product Schemas
const productQuerySchema = paginationSchema.extend({
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(['createdAt', 'basePrice', 'averageRating', 'purchaseCount', 'viewCount']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().trim().max(255).optional(),
    inStock: z.string().transform((v) => v === 'true').optional(),
});

// Cart Schemas
const addToCartSchema = z.object({
    productId: uuidSchema,
    variantId: uuidSchema.optional(),
    quantity: z.number().int().min(1).max(100).default(1),
});

module.exports = {
    validate,
    validateQuery,
    schemas: {
        register: registerSchema,
        login: loginSchema,
        forgotPassword: forgotPasswordSchema,
        resetPassword: resetPasswordSchema,
        changePassword: changePasswordSchema,
        createOrder: createOrderSchema,
        createReview: createReviewSchema,
        productQuery: productQuerySchema,
        addToCart: addToCartSchema,
        pagination: paginationSchema,
    },
};
