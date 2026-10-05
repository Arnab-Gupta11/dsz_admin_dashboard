'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle/mode-toggle';
import NotificationDropdown from './NotificationDropdown/NotificationDropdown';
import UserDropdown from './UserDropdown/UserDropdown';

function RightSection() {
  return (
    <div className="flex items-center gap-3">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* <Link
        href="/dashboard/account"
        className="hover:text-primary border-border bg-card text-muted-foreground dark:hover:bg-muted dark:hover:border-border hover:border-primary/20 hover:bg-primary/10 relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm border transition-all active:scale-95"
      >
        <Settings size={18} />
      </Link> */}

      {/* Notification Dropdown */}
      <NotificationDropdown />

      {/* User Dropdown */}
      <UserDropdown />
    </div>
  );
}

export default RightSection;
