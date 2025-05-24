import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Target, Plus } from 'lucide-react';
import { useAdsets } from '../hooks/useAdsets';
import { useCampaign } from '../hooks/useCampaigns';
import { AdSetCard } from '../components/AdSetCard';
import { ChatInterface } from '../components/ChatInterface';
import { AdSet } from '../types';

export const AdSetsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  
  const { data: campaign, isLoading: campaignLoading } = useCampaign(campaignId!);
  const { data: adsets, isLoading, error, refetch } = useAdsets(campaignId!);

  const handleAdSetClick = (adset: AdSet) => {
    navigate(`/adsets/${adset.id}/ads`);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (campaignLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading ad sets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading ad sets</p>
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
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {campaign?.name} - Ad Sets
              </h1>
              <p className="text-gray-600 mt-1">
                Objective: {campaign?.objective?.replace('OUTCOME_', '')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                campaign?.status === 'ACTIVE' 
                  ? 'text-green-600 bg-green-50 border border-green-200' 
                  : 'text-yellow-600 bg-yellow-50 border border-yellow-200'
              }`}>
                {campaign?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ad Sets Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Ad Sets ({adsets?.length || 0})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {adsets && adsets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adsets.map((adset) => (
                <AdSetCard
                  key={adset.id}
                  adset={adset}
                  onClick={handleAdSetClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ad sets yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first ad set to start targeting your audience.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Ad Set
              </button>
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
              Get help with creating and optimizing ad sets for your campaign.
            </p>
          </div>
          <ChatInterface context={{ 
            type: 'adsets', 
            data: adsets, 
            campaignId: campaignId!,
            campaign: campaign 
          }} />
        </div>
      </div>
    </div>
  );
};