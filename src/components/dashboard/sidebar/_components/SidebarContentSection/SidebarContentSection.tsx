/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUserRole } from '@/hooks/useCurrentUserRole';
import { AdminRoutes } from '../../sidebarRoutes';
import { UserCog } from 'lucide-react';
import React from 'react';

function SidebarContentSection() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state } = useSidebar();
  const { role } = useCurrentUserRole();

  const menuItems = React.useMemo(() => {
    const routes = [...AdminRoutes];
    if (role === 'SUPER_ADMIN') {
      routes.push({
        title: "Admin Management",
        url: "/dashboard/admins",
        icon: UserCog as any,
      });
    }
    return routes;
  }, [role]);

  return (
    <SidebarContent className={`no-scrollbar pt-4 ${state === 'expanded' ? 'px-3' : 'px-2'}`}>
      <SidebarMenu className="gap-3">
        {menuItems.map((item: any) => {
          const isActive = pathname === item?.url;
          const Icon = item?.icon;

          return (
            <SidebarMenuItem key={item?.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={state === 'collapsed' ? item?.title : undefined}
                className={`rounded-sm px-3 py-5.5! font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary! text-white!'
                    : 'text-primary-text! hover:text-primary! hover:bg-primary/10 dark:hover:text-primary-text! dark:hover:bg-sidebar-accent!'
                }`}
              >
                <Link
                  href={item?.url}
                  onClick={() => isMobile && setOpenMobile(false)}
                  className="flex items-center gap-3"
                >
                  {Icon && (
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-primary-text/70 group-hover:text-primary dark:group-hover:text-primary-text/70'
                      }
                    />
                  )}
                  {state !== 'collapsed' && <span className="text-sm">{item?.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>
  );
}

export default SidebarContentSection;
