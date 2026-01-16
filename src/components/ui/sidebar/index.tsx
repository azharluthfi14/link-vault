'use client';

import { cn } from '@heroui/react';
import { Link2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { SIDEBAR_MENUS } from './menu';
import { SidebarItems } from './sidebar-items';

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-gray-200 bg-white'
      )}>
      <div className="flex h-16 items-center border-b border-gray-200 p-4">
        <div className="bg-primary mr-3 flex size-8 items-center justify-center rounded-lg text-white">
          <Link2 size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-800">
          Link Vault
        </span>
      </div>
      <nav className="flex-1 items-center justify-center space-y-2 overflow-y-auto p-4 py-4">
        {SIDEBAR_MENUS?.map((menu) => (
          <SidebarItems
            key={menu.id}
            item={menu}
            isActive={menu?.href === pathname}
          />
        ))}
      </nav>
    </aside>
  );
};
