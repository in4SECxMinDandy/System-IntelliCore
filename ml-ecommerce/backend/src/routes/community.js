// ==========================================
// Community Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const communityController = require('../controllers/communityController');

// Posts
router.get('/posts', optionalAuth, communityController.getPosts);
router.post('/posts', authenticate, communityController.createPost);
router.get('/posts/:id', optionalAuth, communityController.getPost);
router.delete('/posts/:id', authenticate, communityController.deletePost);

// Likes
router.post('/posts/:postId/like', authenticate, communityController.toggleLike);

// Comments
router.post('/posts/:postId/comments', authenticate, communityController.addComment);

// Follow
router.post('/users/:userId/follow', authenticate, communityController.followUser);
router.get('/users/:userId/followers', communityController.getFollowers);
router.get('/users/:userId/following', communityController.getFollowing);

// Challenges
router.get('/challenges', communityController.getChallenges);
router.post('/challenges/:challengeId/join', authenticate, communityController.joinChallenge);

// Leaderboard
router.get('/leaderboard', communityController.getLeaderboard);

module.exports = router;
