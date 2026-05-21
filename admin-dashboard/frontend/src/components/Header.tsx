"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        value={searchVal}
        onChange={handleSearchChange}
        className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
      />
    </div>
  );
}

const Header = ({ setIsOpen }: { setIsOpen: (val: boolean) => void }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 -ml-1 mr-4 md:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex items-center text-sm text-gray-500">
          <span className="font-medium text-gray-900">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <Suspense fallback={<div className="w-48 h-10 bg-gray-100 rounded-md animate-pulse"></div>}>
            <SearchInput />
          </Suspense>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-500 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;

