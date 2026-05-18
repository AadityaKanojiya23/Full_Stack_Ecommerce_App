"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

const ORDER_STATUSES = [
  'Confirmed',
  'Baking',
  'Packed',
  'Out for delivery',
  'Delivered',
  'Cancelled'
];

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      // Mocking fetch specific order since we don't have GET /orders/:id yet. 
      // Instead we can fetch all and find, or just add the endpoint later. Let's fetch all and find.
      const res = await api.get('/admin/orders');
      const found = (res.data.orders || []).find((o: any) => o._id === params.id);
      setOrder(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await api.put(`/admin/orders/${order._id}/status`, { status });
      fetchOrder(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  const currentStatusIndex = ORDER_STATUSES.indexOf(order.status);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order #{order._id.substring(0, 8)}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Tracking</h2>
            
            <div className="relative border-l border-gray-200 ml-3 space-y-8">
              {ORDER_STATUSES.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                // Find timestamp if available
                const update = order.timeline?.find((u: any) => u.status === status);

                return (
                  <div key={status} className="relative pl-8">
                    <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${
                      isCompleted ? 'bg-black text-white' : 'bg-gray-100 border border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </span>
                    <div className="flex flex-col">
                      <h3 className={`text-sm font-medium ${isCurrent ? 'text-black font-bold' : (isCompleted ? 'text-gray-900' : 'text-gray-500')}`}>
                        {status}
                      </h3>
                      {update && (
                        <span className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md border"
              >
                {ORDER_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-medium text-gray-900">Name:</span> {order.shippingAddress?.name || order.user?.name || 'Guest'}</p>
              <p><span className="font-medium text-gray-900">Email:</span> {order.user?.email || 'N/A'}</p>
              <p><span className="font-medium text-gray-900">Address:</span> {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'N/A'}</p>
              <p><span className="font-medium text-gray-900">Payment:</span> {order.payment?.status || 'Pending'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name || 'Unknown Product'} x {item.quantity}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex justify-between font-medium">
                <span>Total Amount</span>
                <span>${order.pricing?.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
