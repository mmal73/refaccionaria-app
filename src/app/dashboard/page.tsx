'use client';

import React from 'react';
import { 
  BarChart, 
  Wallet, 
  Package, 
  AlertTriangle, 
  ShoppingBag,
  TrendingUp,
  History
} from 'lucide-react';
import { 
  StatCard, 
  SalesChart, 
  LowStockTable 
} from '../../presentation/components/dashboard';
import { useDashboardStats } from '../../presentation/hooks/useDashboardStats';
import { formatMoney, formatDate } from '../../shared/utils/formatters';

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboardStats();

  // Mapear datos para la gráfica (Recharts necesita un array plano)
  const chartData = stats?.topSellingProducts.map((p: any) => ({
    name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
    total: p.totalSold // Usamos totalSold para la gráfica de barras
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">En vivo</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 font-medium mt-1">
            Resumen operativo y métricas de inventario de hoy.
          </p>
        </div>
        
        <div className="bg-white border p-3 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Última Actualización</p>
            <p className="text-sm font-bold text-gray-900">
              {formatDate(new Date(), "eeee, d 'de' MMMM")}
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Valor Inventario"
          value={formatMoney(stats?.totalInventoryValue)}
          icon={Wallet}
          isLoading={isLoading}
          trendType="positive"
        />
        <StatCard
          title="Productos Totales"
          value={stats?.totalProducts || 0}
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="Ventas Recientes"
          value={stats?.recentSales.length || 0}
          icon={ShoppingBag}
          isLoading={isLoading}
          trend="Últimos 7 días"
        />
        <StatCard
          title="Alertas de Stock"
          value={stats?.lowStockCount || 0}
          icon={AlertTriangle}
          isLoading={isLoading}
          trend={stats?.lowStockCount && stats.lowStockCount > 0 ? "Reponer pronto" : "Todo despejado"}
          trendType={stats?.lowStockCount && stats.lowStockCount > 3 ? "negative" : "neutral"}
        />
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <SalesChart data={chartData} isLoading={isLoading} />
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Ventas Recientes</h3>
              <Link href="/pos" className="text-xs font-black text-blue-600 hover:underline uppercase">Nueva Venta</Link>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50/50 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                       <div className="w-32 h-4 bg-gray-200 rounded" />
                       <div className="w-24 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              ) : stats?.recentSales.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-sm italic">No hay ventas registradas recientemente.</p>
              ) : (
                stats?.recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {sale.customerName || 'Venta a Mostrador'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {formatDate(sale.date, "d MMM, HH:mm")} • {sale.items.length} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">
                        {formatMoney(sale.totalAmount.amount, sale.totalAmount.currency)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side Column: Alerts */}
        <div className="lg:col-span-1">
          <LowStockTable 
            items={stats?.lowStockProducts || []} 
            isLoading={isLoading}
          />
          {/* Note: In a real scenario, we would use a dedicated endpoint or filtered stats. 
              Applying a simple filter from all products loaded for now or using lowStockProducts query. */}
          
          {/* Correction: Use a separate way to get low stock products or include them in DashboardStats */}
          <div className="mt-8">
             <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <TrendingUp className="w-10 h-10 mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-black mb-2 leading-tight">¿Necesitas abastecer?</h4>
                  <p className="text-blue-100 text-sm font-medium mb-6">Revisa el inventario completo y genera alertas automáticas.</p>
                  <Link href="/products" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-white/20 transition-all active:scale-95">
                    Ir a Inventario
                  </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
