import type { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}


