const { prisma } = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true, role: true, emailVerified: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, phone, avatarUrl },
      select: { id: true, email: true, fullName: true, phone: true, avatarUrl: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
    res.json({ success: true, message: 'Password updated' });
  } catch (err) { next(err); }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
    res.json({ success: true, data: addresses });
  } catch (err) { next(err); }
};

exports.addAddress = async (req, res, next) => {
  try {
    const address = await prisma.address.create({ data: { userId: req.user.id, ...req.body } });
    res.status(201).json({ success: true, data: address });
  } catch (err) { next(err); }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const address = await prisma.address.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: req.body,
    });
    res.json({ success: true, data: address });
  } catch (err) { next(err); }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) { next(err); }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: notifications });
  } catch (err) { next(err); }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { isRead: true },
    });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) { next(err); }
};

exports.adminList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
        skip, take: Number(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
    res.json({ success: true, data: { id: updated.id, isActive: updated.isActive } });
  } catch (err) { next(err); }
};
