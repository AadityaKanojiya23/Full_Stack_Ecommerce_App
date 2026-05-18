"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStockChange = async (id: string, status: string) => {
    try {
      await api.put(`/admin/products/${id}`, { 
        status,
        isSoldOut: status === 'Sold Out' || status === 'Out Of Stock',
        inventory: status === 'In Stock' ? 50 : 0
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link 
          href="/products/new" 
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const currentStatus = product.status || (product.isSoldOut || product.inventory <= 0 ? 'Sold Out' : 'In Stock');
                return (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.images?.[0] || product.image || 'https://via.placeholder.com/40'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(product.discountPrice || product.price)?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.inventory || product.stockQuantity || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStockChange(product._id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2 py-1 ${
                        currentStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
                        currentStatus === 'Out Of Stock' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      } border-none focus:ring-0`}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/products/${product._id}`} className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
