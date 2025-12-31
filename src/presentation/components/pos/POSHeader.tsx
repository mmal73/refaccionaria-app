import React from 'react';

interface POSHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">PUNTO DE VENTA</h1>
      </div>
      
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </header>
  );
};
