import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsetAPI } from '../services/api';
import { AdSet } from '../types';

export const useAdsets = (campaignId: string) => {
  return useQuery({
    queryKey: ['adsets', campaignId],
    queryFn: () => adsetAPI.getByCampaignId(campaignId),
    enabled: !!campaignId,
  });
};

export const useAdset = (id: string) => {
  return useQuery({
    queryKey: ['adset', id],
    queryFn: () => adsetAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateAdset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adsetAPI.create,
    onSuccess: (newAdset) => {
      queryClient.invalidateQueries({
        queryKey: ['adsets', newAdset.campaign_id],
      });
    },
  });
};

export const useUpdateAdset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AdSet> }) =>
      adsetAPI.update(id, updates),
    onSuccess: (updatedAdset) => {
      queryClient.invalidateQueries({
        queryKey: ['adsets', updatedAdset.campaign_id],
      });
      queryClient.invalidateQueries({ queryKey: ['adset', updatedAdset.id] });
    },
  });
};

export const useDeleteAdset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adsetAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adsets'] });
    },
  });
};
