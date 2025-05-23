import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: ({ message, action, campaignData }: { 
      message: string; 
      action?: string; 
      campaignData?: any 
    }) => chatAPI.sendMessage(message, action, campaignData),
    onSuccess: (response) => {
      setMessages(prev => [...prev, response]);
      
      // If a campaign was created, refresh the campaigns list
      if (response.campaignCreated) {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    },
  });

  const clearContextMutation = useMutation({
    mutationFn: chatAPI.clearContext,
    onSuccess: () => {
      setMessages([]);
    },
  });

  const sendMessage = (content: string, action?: string, campaignData?: any) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Send to API
    sendMessageMutation.mutate({ message: content, action, campaignData });
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