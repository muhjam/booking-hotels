import apiClient from '@/lib/api-client';
import { Hotel } from '@/types';

export const fetchHotels = async () => {
  const response = await apiClient.get<Hotel[]>('/hotels');
  return response.data;
};

export const fetchHotel = async (id: string) => {
  const response = await apiClient.get<Hotel>(`/hotels/${id}`);
  return response.data;
};

export const createHotel = async (data: Partial<Hotel>) => {
  const response = await apiClient.post<Hotel>('/hotels', data);
  return response.data;
};

export const updateHotel = async (id: string, data: Partial<Hotel>) => {
  const response = await apiClient.patch<Hotel>(`/hotels/${id}`, data);
  return response.data;
};

export const deleteHotel = async (id: string) => {
  const response = await apiClient.delete(`/hotels/${id}`);
  return response.data;
};
