import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Zap } from 'lucide-react';
import { useCampaigns, useUpdateCampaign } from '../hooks/useCampaigns';
import { CampaignCard } from '../components/CampaignCard';
import { ChatInterface } from '../components/ChatInterface';
import { Campaign } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: campaigns, isLoading, error, refetch } = useCampaigns();
  const updateCampaignMutation = useUpdateCampaign();

  const handleStatusToggle = (id: string, newStatus: Campaign['status']) => {
    updateCampaignMutation.mutate({ id, updates: { status: newStatus } });
  };

  const handleCampaignClick = (campaign: Campaign) => {
    navigate(`/campaigns/${campaign.id}/adsets`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading campaigns</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaigns Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Active Campaigns ({campaigns?.length || 0})
              </h2>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {campaigns && campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onStatusToggle={handleStatusToggle}
                    onClick={handleCampaignClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No campaigns yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first campaign using the AI
                  assistant.
                </p>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                AI Assistant
              </h2>
              <p className="text-gray-600 text-sm">
                Chat with our AI to create new campaigns quickly and easily.
              </p>
            </div>
            <ChatInterface context={{ type: 'campaigns', data: campaigns }} />
          </div>
        </div>
      </div>
  );
};
