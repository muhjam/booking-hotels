import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchHotels, fetchHotel, createHotel, updateHotel, deleteHotel } from '@/services/api/hotel';
import { Hotel } from '@/types';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
  });
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ['hotels', id],
    queryFn: () => fetchHotel(id),
    enabled: !!id,
  });
};

export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hotel> }) => updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
  });
};
