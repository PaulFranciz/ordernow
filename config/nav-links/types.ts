import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  description: string;
  icon: any;
}

export interface LocationItem extends NavItem {
  mapUrl: string;
}

export interface ContactItem extends NavItem {
  email: string;
} 