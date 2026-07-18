import { Request, Response, NextFunction } from 'express';
import { communityService } from '../services/community.service';

export class CommunityController {
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { postType, search, page, pageSize } = req.query;
      const result = await communityService.getPosts({
        postType: postType as string,
        search: search as string,
        page: parseInt(page as string) || 1,
        pageSize: parseInt(pageSize as string) || 20,
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await communityService.getPostById(id);
      res.json({ success: true, data: post });
    } catch (error) { next(error); }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const post = await communityService.createPost({ ...req.body, authorId: userId });
      res.status(201).json({ success: true, data: post });
    } catch (error) { next(error); }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await communityService.likePost(id);
      res.json({ success: true, data: post });
    } catch (error) { next(error); }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { postId } = req.params;
      const comment = await communityService.addComment(postId, userId, req.body.content);
      res.status(201).json({ success: true, data: comment });
    } catch (error) { next(error); }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      await communityService.deletePost(id, userId);
      res.json({ success: true, message: '已删除' });
    } catch (error) { next(error); }
  }
}

export const communityController = new CommunityController();
