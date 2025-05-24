import { Request, Response } from 'express';
import { AIService } from '../services/ai-agent-service/aiService';
import { CampaignModel } from '../models/Campaign';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse } from '../types';

export class ChatController {
  static async handleChatMessage(req: Request, res: Response) {
    try {
      const { message, action, context, contextData }: ChatRequest = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Generate AI response with context
      const aiResponse = await AIService.generateResponse(
        message,
        req.user?.id,
        (context as any) || 'campaigns',
        contextData
      );

      const response: ChatResponse = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
      };

      // Include any action results (created items, etc.)
      if (aiResponse.actionResult) {
        response.actionResult = aiResponse.actionResult;
      }

      // Include refresh flag
      if (aiResponse.shouldRefresh) {
        response.shouldRefresh = true;
      }

      res.json(response);
    } catch (error) {
      console.error('Error handling chat message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async clearChatContext(req: Request, res: Response) {
    try {
      AIService.clearContext();
      res.json({ message: 'Chat context cleared successfully' });
    } catch (error) {
      console.error('Error clearing chat context:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
