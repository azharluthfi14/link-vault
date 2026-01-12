import { LayoutDashboard, Link2 } from 'lucide-react';

import type { SidebarMenu } from './types';

export const SIDEBAR_MENUS: SidebarMenu[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    id: 'short-link',
    label: 'My Link',
    href: '/short-link',
    icon: <Link2 className="size-5" />,
  },
];
