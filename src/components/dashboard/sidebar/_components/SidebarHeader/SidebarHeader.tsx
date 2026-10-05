'use client';

import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/ui/Logo';

function SidebarHeaderSection() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarHeader className="border-border border-b py-4 flex items-center justify-center">
      <Logo compact={!isExpanded} className={!isExpanded ? 'justify-center w-full' : ''} />
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
