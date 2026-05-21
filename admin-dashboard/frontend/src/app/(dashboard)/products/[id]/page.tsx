"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    stockQuantity: '',
    image: '',
    status: 'In Stock'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get('/products?limit=1000');
        const productsArray = res.data.products || res.data;
        const prod = productsArray.find((p: any) => p._id === params.id);
        if (prod) {
          setFormData({
            name: prod.name,
            price: prod.price.toString(),
            discountPrice: (prod.discountPrice !== undefined ? prod.discountPrice : prod.price).toString(),
            description: prod.description,
            category: prod.category,
            stockQuantity: (prod.inventory !== undefined ? prod.inventory : prod.stockQuantity || 0).toString(),
            image: prod.image || (prod.images ? prod.images[0] : ''),
            status: prod.isSoldOut ? 'Sold Out' : (prod.inventory > 0 ? 'In Stock' : 'Out Of Stock')
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const priceVal = Number(formData.price);
      const discountPriceVal = formData.discountPrice ? Number(formData.discountPrice) : priceVal;

      await api.put(`/admin/products/${params.id}`, {
        ...formData,
        price: priceVal,
        discountPrice: discountPriceVal,
        inventory: Number(formData.stockQuantity),
        isSoldOut: formData.status === 'Sold Out',
        images: [formData.image]
      });
      router.push('/products');
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Price (₹)</label>
            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Offer Price (₹) <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
            <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" placeholder="Leave empty for no discount" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input required type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input required type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm">
              <option value="In Stock">In Stock</option>
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input required type="text" name="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" placeholder="https://..." />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
          <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-black py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
