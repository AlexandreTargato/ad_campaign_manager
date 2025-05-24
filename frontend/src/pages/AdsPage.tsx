import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Image, Plus } from 'lucide-react';
import { useAds, useUpdateAd } from '../hooks/useAds';
import { useAdset } from '../hooks/useAdsets';
import { AdCard } from '../components/AdCard';
import { ChatInterface } from '../components/ChatInterface';
import { Ad } from '../types';

export const AdsPage: React.FC = () => {
  const { adsetId } = useParams<{ adsetId: string }>();
  const navigate = useNavigate();
  
  const { data: adset, isLoading: adsetLoading } = useAdset(adsetId!);
  const { data: ads, isLoading, error, refetch } = useAds(adsetId!);
  const updateAdMutation = useUpdateAd();

  const handleStatusToggle = (id: string, newStatus: Ad['status']) => {
    updateAdMutation.mutate({ id, updates: { status: newStatus } });
  };

  const handleBackClick = () => {
    if (adset?.campaign_id) {
      navigate(`/campaigns/${adset.campaign_id}/adsets`);
    } else {
      navigate('/');
    }
  };

  if (adsetLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading ads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading ads</p>
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
          Back to Ad Sets
        </button>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {adset?.name} - Ads
              </h1>
              <p className="text-gray-600 mt-1">
                Daily Budget: ${adset ? (adset.daily_budget / 100).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-mono">
                ID: {adset?.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ads Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Ads ({ads?.length || 0})
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

          {ads && ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onStatusToggle={handleStatusToggle}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ads yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first ad to start reaching your audience.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Ad
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
              Get help with creating and optimizing ads for your ad set.
            </p>
          </div>
          <ChatInterface context={{ 
            type: 'ads', 
            data: ads, 
            adsetId: adsetId!,
            adset: adset 
          }} />
        </div>
      </div>
    </div>
  );
};