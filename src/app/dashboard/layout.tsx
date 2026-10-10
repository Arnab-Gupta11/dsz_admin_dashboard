'use client';

import { Suspense } from 'react';
import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationBar />
        <main className="bg-bg! text-primary-text! h-full w-full p-4">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
