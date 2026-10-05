'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="hover:bg-primary/5 relative cursor-pointer rounded-full p-2 transition-colors focus:outline-none">
          <Bell className="text-secondary-text h-5 w-5" />
          <span className="bg-danger absolute top-1.5 right-2 h-2 w-2 rounded-full" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="p-8 text-center text-sm text-secondary-text">
          No new notifications.
        </div>
      </PopoverContent>
    </Popover>
  );
}
