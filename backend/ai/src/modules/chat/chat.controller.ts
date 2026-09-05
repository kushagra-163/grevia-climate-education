import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';

export class ChatController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: { message: 'Messages array required', code: 'INVALID_INPUT' } });
      }

      const result = await ChatService.handleChat(userId || 'anonymous', messages, context);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
