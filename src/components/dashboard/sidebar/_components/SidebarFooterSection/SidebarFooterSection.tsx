'use client';

import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function SidebarFooterSection() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarFooter
      className={cn(
        'border-border border-t transition-all duration-300',
        isExpanded ? 'px-4 py-4' : 'px-2 py-4',
      )}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          {isExpanded ? (
            <div className="bg-bg rounded-sm px-3 py-3">
              <p className="text-primary-text/70 text-xs font-semibold">© 2026 Digital Soft Zone</p>
              <p className="text-primary-text/50 mt-0.5 text-[10px]">All rights reserved.</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-sm">
                <span className="text-xs font-black text-[#041c26]">D</span>
              </div>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
