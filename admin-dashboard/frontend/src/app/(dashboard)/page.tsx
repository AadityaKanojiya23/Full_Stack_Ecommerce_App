"use client";

import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchStats = async () => {
    // Wait until token is available
    let retries = 0;
    while (!Cookies.get('token') && retries < 10) {
      await new Promise(r => setTimeout(r, 500));
      retries++;
    }
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/orders'),
      ]);
      if (analyticsRes.data.summary) {
        setStats({
          totalOrders: analyticsRes.data.summary.totalOrders,
          revenue: analyticsRes.data.summary.totalSales,
          pendingOrders: analyticsRes.data.summary.pendingOrdersCount,
          deliveredOrders: analyticsRes.data.summary.deliveredCount
        });
      }
      setRecentOrders(ordersRes.data.orders?.slice(0, 5) || []);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Delivered', value: stats.deliveredOrders, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const statusColor: Record<string, string> = {
    'Confirmed': 'bg-gray-100 text-gray-700',
    'Baking': 'bg-orange-100 text-orange-700',
    'Packed': 'bg-blue-100 text-blue-700',
    'Out for delivery': 'bg-yellow-100 text-yellow-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.name} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center">
            <div className={`p-3 rounded-lg ${card.bg} mr-4`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.name}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.shippingAddress?.name || order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user?.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.pricing?.totalAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.payment?.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.payment?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-gray-400 text-sm">Loading orders...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
