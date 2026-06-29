import apiClient from '@/lib/api-client';
import { Booking } from '@/types';

export const fetchBookings = async () => {
  const response = await apiClient.get<Booking[]>('/bookings');
  return response.data;
};

export const fetchBooking = async (id: string) => {
  const response = await apiClient.get<Booking & { hotel: any }>(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (data: Partial<Booking>) => {
  const response = await apiClient.post<Booking>('/bookings', data);
  return response.data;
};

export const fetchStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};
