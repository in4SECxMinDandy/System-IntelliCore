// ==========================================
// Community Controller
// ==========================================

const { prisma } = require('../config/database');

// ==========================================
// POSTS
// ==========================================

exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, tag, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isApproved: true,
      ...(tag && { tags: { has: tag } }),
      ...(userId && { userId }),
    };

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, avatarUrl: true, role: true },
          },
        },
      }),
      prisma.communityPost.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: posts,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { content, images = [], tags = [], productId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId,
        content: content.trim(),
        images,
        tags,
        productId: productId || null,
      },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        comments: {
          where: { parentId: null },
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
            replies: {
              include: {
                user: { select: { id: true, fullName: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.userId !== userId && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await prisma.communityPost.delete({ where: { id } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// LIKES
// ==========================================

exports.toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.communityLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.communityLike.delete({
        where: { postId_userId: { postId, userId } },
      });
      await prisma.communityPost.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
      return res.json({ success: true, liked: false });
    }

    await prisma.communityLike.create({ data: { postId, userId } });
    await prisma.communityPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    res.json({ success: true, liked: true });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// COMMENTS
// ==========================================

exports.addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    await prisma.communityPost.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// FOLLOW
// ==========================================

exports.followUser = async (req, res, next) => {
  try {
    const { userId: followingId } = req.params;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const existing = await prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await prisma.userFollow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
      return res.json({ success: true, following: false });
    }

    await prisma.userFollow.create({ data: { followerId, followingId } });
    res.json({ success: true, following: true });
  } catch (err) {
    next(err);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
    res.json({ success: true, data: followers.map(f => f.follower) });
  } catch (err) {
    next(err);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
    res.json({ success: true, data: following.map(f => f.following) });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// CHALLENGES
// ==========================================

exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { entries: true } },
      },
      orderBy: { endsAt: 'asc' },
    });

    res.json({ success: true, data: challenges });
  } catch (err) {
    next(err);
  }
};

exports.joinChallenge = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ success: false, message: 'Challenge not found or inactive' });
    }

    const entry = await prisma.challengeEntry.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      update: { content },
      create: { challengeId, userId, content },
    });

    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// LEADERBOARD
// ==========================================

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    // Calculate leaderboard based on reviews, purchases, and community activity
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        loyaltyPoints: true,
        _count: {
          select: {
            reviews: true,
            orders: true,
            communityPosts: true,
          },
        },
      },
      orderBy: { loyaltyPoints: 'desc' },
      take: parseInt(limit),
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.fullName,
      avatarUrl: user.avatarUrl,
      points: user.loyaltyPoints,
      reviews: user._count.reviews,
      purchases: user._count.orders,
      posts: user._count.communityPosts,
    }));

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    next(err);
  }
};
