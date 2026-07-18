import { Router } from 'express';
import { communityController } from '../controllers/community.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/posts', (req, res, next) => communityController.getPosts(req, res, next));
router.get('/posts/:id', (req, res, next) => communityController.getPostById(req, res, next));
router.post('/posts', (req, res, next) => communityController.createPost(req, res, next));
router.post('/posts/:id/like', (req, res, next) => communityController.likePost(req, res, next));
router.post('/posts/:postId/comments', (req, res, next) => communityController.addComment(req, res, next));
router.delete('/posts/:id', (req, res, next) => communityController.deletePost(req, res, next));

export default router;
