'use client';

import { Button, cn, Link } from '@heroui/react';

import type { SidebarMenuItem } from './types';

export const SidebarItems = ({ isActive, item }: SidebarMenuItem) => {
  return (
    <Button
      size="md"
      as={Link}
      href={item?.href}
      radius="sm"
      color={isActive ? 'primary' : 'primary'}
      variant={isActive ? 'solid' : 'light'}
      className={cn(
        'flex w-full items-center justify-start text-sm shadow-none',
        isActive ? 'text-white' : 'text-gray-900'
      )}>
      {item.icon}
      <span className="font-semibold">{item.label}</span>
    </Button>
  );
};
