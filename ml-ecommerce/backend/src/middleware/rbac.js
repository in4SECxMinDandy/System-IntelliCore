// ==========================================
// RBAC (Role-Based Access Control) Middleware (Phase 1.1)
// Fine-grained authorization for admin/staff/superadmin actions
// ==========================================

const { prisma } = require('../config/database');

/**
 * Middleware factory: checks if authenticated user has one of the allowed roles.
 * Usage: authorize('admin', 'superadmin')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        });
    }
    next();
};

/**
 * Middleware: ensures user is admin or superadmin
 */
const isAdmin = authorize('admin', 'superadmin');

/**
 * Middleware: ensures user is staff, admin or superadmin
 */
const isStaff = authorize('staff', 'admin', 'superadmin');

/**
 * Middleware: ensures user is superadmin only (for destructive actions)
 */
const isSuperAdmin = authorize('superadmin');

/**
 * Middleware: ensures user owns a resource (or is admin/superadmin).
 * @param {Function} getResourceUserId - async fn(req) => userId of the resource owner
 * 
 * Example usage:
 *   router.delete('/:id', authenticate, ownsResource(req => orderService.getOwner(req.params.id)), ...)
 */
const ownsResource = (getResourceUserId) => async (req, res, next) => {
    try {
        if (['admin', 'superadmin'].includes(req.user?.role)) {
            return next(); // admins bypass ownership check
        }
        const resourceUserId = await getResourceUserId(req);
        if (!resourceUserId || resourceUserId !== req.user?.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource',
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware: verifies account is active (non-banned/deleted)
 */
const requireActiveAccount = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { isActive: true, emailVerified: true },
        });
        if (!user || !user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.',
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Middleware: verifies email is verified (for purchase/review actions)
 */
const requireVerifiedEmail = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { emailVerified: true },
        });
        if (!user?.emailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email verification required. Please verify your email address.',
                code: 'EMAIL_NOT_VERIFIED',
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    authorize,
    isAdmin,
    isStaff,
    isSuperAdmin,
    ownsResource,
    requireActiveAccount,
    requireVerifiedEmail,
};
