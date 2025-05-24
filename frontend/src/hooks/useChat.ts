import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: ({
      message,
      action,
      campaignData,
      context,
      contextData,
    }: {
      message: string;
      action?: string;
      campaignData?: any;
      context?: string;
      contextData?: any;
    }) =>
      chatAPI.sendMessage(message, action, campaignData, context, contextData),
    onSuccess: (response) => {
      setMessages((prev) => [...prev, response]);

      // If a tool was executed that requires refresh, invalidate all queries
      if (response.shouldRefresh) {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        queryClient.invalidateQueries({ queryKey: ['adsets'] });
        queryClient.invalidateQueries({ queryKey: ['ads'] });
      }
    },
  });

  const clearContextMutation = useMutation({
    mutationFn: chatAPI.clearContext,
    onSuccess: () => {
      setMessages([]);
    },
  });

  const sendMessage = (
    content: string,
    action?: string,
    campaignData?: any,
    context?: string,
    contextData?: any
  ) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to API
    sendMessageMutation.mutate({
      message: content,
      action,
      campaignData,
      context,
      contextData,
    });
  };

  const clearMessages = () => {
    clearContextMutation.mutate();
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
};
