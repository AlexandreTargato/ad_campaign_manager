import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Trash2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';

interface ChatInterfaceProps {
  context?: {
    type: 'campaigns' | 'adsets' | 'ads';
    data?: any;
    campaignId?: string;
    adsetId?: string;
  };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ context }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, clearMessages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input.trim(), undefined, undefined, context?.type, context);
    setInput('');
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI Campaign Assistant</h3>
        </div>
        <button
          onClick={clearMessages}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">
              Start a conversation to create a new campaign!
            </p>
            <p className="text-xs mt-1">
              Try saying "I want to create a new campaign"
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>

            {/* Show action result */}
            {message.actionResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-sm text-green-800">
                  <strong>Action Result:</strong>
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(message.actionResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  handleSubmit(e);
                }
              }
            }}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] max-h-[160px]"
            disabled={isLoading}
            rows={2}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
