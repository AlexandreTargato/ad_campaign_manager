import React from 'react';
import { DollarSign, Target } from 'lucide-react';
import { AdSet } from '../types';

interface AdSetCardProps {
  adset: AdSet;
  onClick?: (adset: AdSet) => void;
}

export const AdSetCard: React.FC<AdSetCardProps> = ({ adset, onClick }) => {
  const handleClick = () => {
    onClick?.(adset);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {adset.name}
          </h3>
        </div>
        <Target className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Daily Budget
          </span>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              ${(adset.daily_budget / 100).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Campaign ID</span>
          <span className="text-sm text-gray-500 font-mono">
            {adset.campaign_id.slice(0, 8)}...
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Ads →
        </button>
      </div>
    </div>
  );
};
