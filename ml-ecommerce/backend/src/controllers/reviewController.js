const { prisma } = require('../config/database');

exports.listByProduct = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: req.params.productId, isApproved: true },
        include: { user: { select: { fullName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip, take: Number(limit),
      }),
      prisma.review.count({ where: { productId: req.params.productId, isApproved: true } }),
    ]);
    res.json({ success: true, data: reviews, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { productId, orderId, rating, buildQuality, deliverySpeed, valueForMoney, title, content, images, sentiment, fakeProb } = req.body;

    let finalSentiment = sentiment || 'Neutral';
    let finalFakeProb = fakeProb || Math.floor(Math.random() * 20);

    // Call ML Service to analyze the review mathematically
    if (content) {
      try {
        const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
        const response = await fetch(`${mlUrl}/moderation/analyze-review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ review_text: content })
        });

        if (response.ok) {
          const mlData = await response.json();
          finalSentiment = mlData.sentiment;
          finalFakeProb = mlData.fake_prob;
        }
      } catch (mlError) {
        console.error('ML Service Moderation Failed:', mlError.message);
        // Fallback gracefully and accept default or frontend suggestions
      }
    }

    const review = await prisma.review.create({
      data: {
        productId,
        orderId,
        userId: req.user.id,
        rating,
        buildQuality,
        deliverySpeed,
        valueForMoney,
        title,
        content,
        images: images || [],
        sentiment: finalSentiment,
        fakeProb: finalFakeProb
      },
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { rating, title, content } = req.body;
    const review = await prisma.review.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { rating, title, content },
    });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await prisma.review.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    res.json({ success: true, data: review });
  } catch (err) { next(err); }
};
