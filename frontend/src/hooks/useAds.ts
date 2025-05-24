import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adAPI } from '../services/api';
import { Ad } from '../types';

export const useAds = (adsetId: string) => {
  return useQuery({
    queryKey: ['ads', adsetId],
    queryFn: () => adAPI.getByAdsetId(adsetId),
    enabled: !!adsetId,
  });
};

export const useAd = (id: string) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => adAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adAPI.create,
    onSuccess: (newAd) => {
      queryClient.invalidateQueries({ queryKey: ['ads', newAd.adset_id] });
    },
  });
};

export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Ad> }) =>
      adAPI.update(id, updates),
    onSuccess: (updatedAd) => {
      queryClient.invalidateQueries({ queryKey: ['ads', updatedAd.adset_id] });
      queryClient.invalidateQueries({ queryKey: ['ad', updatedAd.id] });
    },
  });
};

export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });
};
