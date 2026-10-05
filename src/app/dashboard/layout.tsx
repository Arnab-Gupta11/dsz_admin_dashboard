'use client';

import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationBar />
        <main className="bg-bg! text-primary-text! h-full w-full overflow-hidden p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
