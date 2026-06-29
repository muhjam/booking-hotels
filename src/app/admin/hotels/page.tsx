'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import TopNav from '@/components/layout/top-nav';
import { useHotels, useDeleteHotel, useCreateHotel, useUpdateHotel } from '@/hooks/use-hotels';
import { formatCurrency } from '@/lib/utils';
import { Hotel, HotelStatus } from '@/types';
import { TableSkeleton } from '@/components/ui/page-skeletons';

export default function HotelManagement() {
  const { data: hotels, isLoading } = useHotels();
  const deleteHotelMutation = useDeleteHotel();
  const createHotelMutation = useCreateHotel();
  const updateHotelMutation = useUpdateHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await deleteHotelMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      price: parseFloat(formData.get('price') as string),
      status: formData.get('status') as HotelStatus,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
    };

    if (editingHotel) {
      await updateHotelMutation.mutateAsync({ id: editingHotel.id, data });
    } else {
      await createHotelMutation.mutateAsync(data);
    }
    setIsModalOpen(false);
    setEditingHotel(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="md:ml-64 min-h-screen">
          <TopNav isAdmin />
          <div className="p-16">
            <TableSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <TopNav isAdmin />
        <div className="p-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-on-background">Hotel Inventory</h2>
              <p className="text-on-surface-variant mt-1">Create, read, update, and delete property listings.</p>
            </div>
            <button
              onClick={() => {
                setEditingHotel(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1 px-6 py-3 bg-primary-container text-on-primary rounded-xl font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Hotel
            </button>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Hotel Name</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Location</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Price (per night)</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {hotels?.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-high flex-shrink-0 overflow-hidden">
                          <img className="w-full h-full object-cover" src={hotel.image || 'https://via.placeholder.com/150'} alt={hotel.name} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-on-background">{hotel.name}</p>
                          <p className="text-sm text-on-surface-variant">UID: #{hotel.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-base font-bold text-secondary">{formatCurrency(hotel.price)}</td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        hotel.status === 'OPERATIONAL' ? "bg-secondary-container/10 text-secondary" :
                        hotel.status === 'MAINTENANCE' ? "bg-on-tertiary-container/10 text-on-tertiary-container" :
                        "bg-error-container text-error"
                      )}>
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingHotel(hotel);
                            setIsModalOpen(true);
                          }}
                          className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant active:scale-90"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(hotel.id)}
                          className="p-1 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant active:scale-90"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-2xl w-full shadow-xl">
            <h3 className="text-2xl font-bold mb-6">{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Hotel Name</label>
                  <input name="name" defaultValue={editingHotel?.name} required className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Location</label>
                  <input name="location" defaultValue={editingHotel?.location} required className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Price per night</label>
                  <input name="price" type="number" defaultValue={editingHotel?.price} required className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Status</label>
                  <select name="status" defaultValue={editingHotel?.status || 'OPERATIONAL'} className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none">
                    <option value="OPERATIONAL">Operational</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Image URL</label>
                  <input name="image" defaultValue={editingHotel?.image || ''} className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-bold text-on-surface-variant">Description</label>
                  <textarea name="description" defaultValue={editingHotel?.description || ''} className="w-full px-4 py-2 rounded-xl border border-outline-variant focus:border-secondary outline-none h-24" />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity">
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
