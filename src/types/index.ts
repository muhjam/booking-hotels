export type HotelStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'DRAFT';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  price: number;
  rating: number;
  image?: string | null;
  status: HotelStatus;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'PENDING' | 'EXPIRED' | 'BOOKED' | 'COMPLETED';

export interface Booking {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  userId?: string | null;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  paymentMethod: string;
  cardNumber?: string | null;
  expiryDate?: string | null;
  cvc?: string | null;
  vaNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
