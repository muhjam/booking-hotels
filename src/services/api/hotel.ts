import apiClient from '@/lib/api-client';
import { Hotel } from '@/types';

export interface HotelFilters {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export const fetchHotels = async (filters?: HotelFilters) => {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.location) params.set('location', filters.location);
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters?.minRating !== undefined) params.set('minRating', String(filters.minRating));

  const query = params.toString();
  const response = await apiClient.get<Hotel[]>(`/hotels${query ? `?${query}` : ''}`);
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
