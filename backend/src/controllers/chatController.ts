import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { CampaignModel } from '../models/Campaign';
import { v4 as uuidv4 } from 'uuid';

export class ChatController {
  static async handleChatMessage(req: Request, res: Response) {
    try {
      const { message, action } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Handle campaign creation action
      if (action === 'create_campaign') {
        const { campaignData } = req.body;

        if (!campaignData || !campaignData.name || !campaignData.objective) {
          return res.status(400).json({
            error: 'Campaign name and objective are required',
          });
        }

        // Add user_id from authenticated user if available
        if (req.user) {
          campaignData.user_id = req.user.id;
        } else {
          return res.status(401).json({
            error: 'Authentication required to create campaigns',
          });
        }

        try {
          const campaign = await CampaignModel.create(campaignData);
          const response = `Great! I've successfully created your campaign "${campaign.name}" with objective ${campaign.objective}. The campaign is now active and ready to go!`;

          AIService.clearContext(); // Clear conversation after successful creation

          return res.json({
            id: uuidv4(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
            campaignCreated: campaign,
          });
        } catch (error) {
          console.error('Error creating campaign via chat:', error);
          const errorResponse =
            'I apologize, but there was an error creating your campaign. Please try again or check the campaign details.';

          return res.json({
            id: uuidv4(),
            role: 'assistant',
            content: errorResponse,
            timestamp: new Date(),
          });
        }
      }

      // Generate AI response
      const aiResponse = await AIService.generateResponse(message, req.user?.id);

      const response: any = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
      };

      if (aiResponse.campaignCreated) {
        response.campaignCreated = aiResponse.campaignCreated;
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
