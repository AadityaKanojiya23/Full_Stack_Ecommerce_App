"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function ProductsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');
  const [editDiscountPriceVal, setEditDiscountPriceVal] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=1000');
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

  const handleSaveInlinePrice = async (id: string) => {
    try {
      const p = Number(editPriceVal);
      const dp = editDiscountPriceVal ? Number(editDiscountPriceVal) : undefined;
      await api.put(`/admin/products/${id}`, { 
        price: p,
        discountPrice: dp !== undefined ? dp : p
      });
      setEditingPriceId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to update price');
    }
  };

  if (loading) return <div>Loading products...</div>;

  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

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
              {filteredProducts.map((product) => {
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingPriceId === product._id ? (
                      <div className="flex flex-col gap-1.5 p-1 bg-gray-50 rounded border border-gray-200 w-36">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold">Price:</span>
                          <input
                            type="number"
                            value={editPriceVal}
                            onChange={(e) => setEditPriceVal(e.target.value)}
                            className="w-20 text-xs border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold">Offer:</span>
                          <input
                            type="number"
                            value={editDiscountPriceVal}
                            onChange={(e) => setEditDiscountPriceVal(e.target.value)}
                            className="w-20 text-xs border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="None"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                          <button
                            onClick={() => handleSaveInlinePrice(product._id)}
                            className="bg-black text-white text-[10px] px-2 py-0.5 rounded hover:bg-gray-800"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="bg-white text-gray-700 text-[10px] border border-gray-300 px-2 py-0.5 rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            ₹{(product.discountPrice || product.price)?.toFixed(2)}
                          </span>
                          {product.discountPrice && product.discountPrice < product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.price?.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            setEditingPriceId(product._id);
                            setEditPriceVal(product.price.toString());
                            setEditDiscountPriceVal((product.discountPrice !== undefined ? product.discountPrice : product.price).toString());
                          }} 
                          className="text-gray-400 hover:text-black p-1 rounded hover:bg-gray-100"
                          title="Edit Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
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
              {filteredProducts.length === 0 && (
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

