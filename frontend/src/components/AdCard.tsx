import React from 'react';
import { Image, ToggleLeft, ToggleRight } from 'lucide-react';
import { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
  onStatusToggle?: (id: string, newStatus: Ad['status']) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onStatusToggle }) => {
  const handleStatusToggle = () => {
    const newStatus = ad.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    onStatusToggle?.(ad.id, newStatus);
  };

  const getStatusColor = (status: Ad['status']) => {
    return status === 'ACTIVE'
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {ad.name}
          </h3>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
              ad.status
            )}`}
          >
            {ad.status}
          </div>
        </div>
        <Image className="w-5 h-5 text-purple-600 flex-shrink-0 ml-2" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Creative ID</span>
          <span className="text-sm text-gray-500 font-mono">
            {ad.creative_id}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Ad Set ID</span>
          <span className="text-sm text-gray-500 font-mono">
            {ad.adset_id.slice(0, 8)}...
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Status</span>
        <button
          onClick={handleStatusToggle}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {ad.status === 'ACTIVE' ? (
            <>
              <ToggleRight className="w-5 h-5" />
              Active
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5" />
              Paused
            </>
          )}
        </button>
      </div>
    </div>
  );
};
