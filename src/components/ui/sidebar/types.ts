import type { User } from 'better-auth';

export interface SidebarMenu {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
}

export interface SidebarMenuItem {
  item: SidebarMenu;
  isActive: boolean;
}

export interface SidebarProps {
  user: User;
}
