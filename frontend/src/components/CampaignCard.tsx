import React from 'react';
import { Calendar, DollarSign, Target, PlayCircle, PauseCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onStatusToggle?: (id: string, newStatus: Campaign['status']) => void;
}

const objectiveLabels = {
  OUTCOME_TRAFFIC: 'Website Traffic',
  OUTCOME_AWARENESS: 'Brand Awareness',
  OUTCOME_ENGAGEMENT: 'Engagement',
  OUTCOME_LEADS: 'Lead Generation',
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onStatusToggle 
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: Campaign['status']) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Campaign['status']) => {
    return status === 'ACTIVE' 
      ? <PlayCircle className="w-4 h-4" />
      : <PauseCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
        <div 
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(campaign.status)}`}
        >
          {getStatusIcon(campaign.status)}
          {campaign.status}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Target className="w-4 h-4 mr-2" />
          <span>{objectiveLabels[campaign.objective]}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Ends: {formatDate(campaign.stop_time)}</span>
        </div>

        {campaign.created_at && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {onStatusToggle && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onStatusToggle(
              campaign.id, 
              campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
            )}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              campaign.status === 'ACTIVE'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {campaign.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          </button>
        </div>
      )}
    </div>
  );
};