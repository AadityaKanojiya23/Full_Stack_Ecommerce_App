"use client";

import React, { useState } from 'react';

export default function SettingsPage() {
  const [password, setPassword] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('5.00');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully (Mock)');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Store Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Charge ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={deliveryCharge} 
                  onChange={(e) => setDeliveryCharge(e.target.value)} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm" 
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Save Settings
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
