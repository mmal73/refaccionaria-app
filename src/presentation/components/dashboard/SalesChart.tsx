'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface SalesChartData {
  name: string;
  total: number;
}

interface SalesChartProps {
  data: SalesChartData[];
  isLoading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col animate-pulse">
        <div className="w-48 h-6 bg-gray-200 rounded mb-8" />
        <div className="flex-1 w-full bg-gray-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Ventas por Producto</h3>
          <p className="text-xs text-gray-400 font-medium">Top de productos más vendidos ($)</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Ventas Totales
          </span>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Vendido']}
            />
            <Bar 
              dataKey="total" 
              radius={[6, 6, 0, 0]} 
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#3b82f6'} fillOpacity={1 - (index * 0.1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
