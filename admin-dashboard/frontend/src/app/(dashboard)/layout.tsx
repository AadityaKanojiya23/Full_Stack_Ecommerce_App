"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="md:pl-64 flex flex-col flex-1">
        <Header setIsOpen={setSidebarOpen} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
