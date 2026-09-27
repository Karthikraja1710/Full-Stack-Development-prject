import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, Shield } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Product Catalog',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Order Management',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Header Badge */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-amber-200">Admin Control Panel</h3>
            <p className="text-[10px] text-amber-400/80">Role-Based Access Active</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Admin Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Return to Store Link */}
      <div className="pt-4 border-t border-slate-800/80">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customer Store
        </NavLink>
      </div>
    </aside>
  );
};
