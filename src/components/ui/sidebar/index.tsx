'use client';

import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { ChevronsLeftRight, Link2, Truck } from 'lucide-react';
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
      <div className="flex h-16 items-center border-b border-slate-100 p-4">
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

      {/* <div className="space-y-4 p-4">
        <Dropdown radius="sm" placement="top" className="">
          <DropdownTrigger>
            <Button
              suppressHydrationWarning={false}
              size="lg"
              radius="sm"
              variant="light"
              className="flex w-full justify-start px-2">
              <Avatar name={user.email[0]} className="bg-primary size-10" />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-0.5 text-start">
                  <div className="text-xxs font-medium">{user.name}</div>
                  <div className="text-xs text-neutral-600">{user.email}</div>
                </div>
                <ChevronsLeftRight className="size-4 rotate-90 text-neutral-500" />
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              className="flex items-center justify-center"
              variant="flat"
              color="danger"
              key={'logout'}>
              logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div> */}
    </aside>
  );
};
