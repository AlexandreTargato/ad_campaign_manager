import Anthropic from '@anthropic-ai/sdk';
import { getToolsForContext, executeToolFunction, ToolContext } from './tools';
import { PromptService } from './prompts';
import { AIServiceResponse } from '../../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AIService {
  private static conversationContext: Map<string, string[]> = new Map();

  static async generateResponse(
    userMessage: string,
    userId?: string,
    context: ToolContext = 'campaigns',
    contextData?: any
  ): Promise<AIServiceResponse> {
    try {
      const contextKey = userId || 'anonymous';
      const currentContext = this.conversationContext.get(contextKey) || [];

      // Get system prompt based on context
      const systemPrompt = PromptService.getSystemPrompt(
        context,
        contextData,
        currentContext
      );

      // Get tools based on context
      const tools = getToolsForContext(context);

      const message = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        system: systemPrompt,
        tools,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      console.log({ message });

      // Handle tool use
      if (message.content.some((content) => content.type === 'tool_use')) {
        const toolUse = message.content.find(
          (content) => content.type === 'tool_use'
        ) as any;

        console.log({ toolUse });

        try {
          const result = await executeToolFunction(
            toolUse.name,
            toolUse.input,
            userId
          );
          const response = PromptService.generateToolResponse(
            toolUse.name,
            result,
            context
          );

          // Clear context after successful operations that change state
          if (
            ['create_campaign', 'create_adset', 'create_ad'].includes(
              toolUse.name
            )
          ) {
            this.clearContext(userId);
          }

          return {
            content: response,
            actionResult: result,
            shouldRefresh: true,
          };
        } catch (error) {
          console.error(`Error executing tool ${toolUse.name}:`, error);
          return {
            content: PromptService.generateErrorResponse(
              toolUse.name,
              context,
              error
            ),
          };
        }
      }

      // Regular text response
      const response = message.content
        .filter((content) => content.type === 'text')
        .map((content) => (content as any).text)
        .join('');

      // Update conversation context
      currentContext.push(`User: ${userMessage}`);
      currentContext.push(`Assistant: ${response}`);

      // Keep only last 20 exchanges to manage context length
      if (currentContext.length > 20) {
        currentContext.splice(0, currentContext.length - 20);
      }

      this.conversationContext.set(contextKey, currentContext);

      return { content: response };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        content:
          'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
      };
    }
  }

  static clearContext(userId?: string): void {
    if (userId) {
      this.conversationContext.delete(userId);
    } else {
      this.conversationContext.clear();
    }
  }
}
