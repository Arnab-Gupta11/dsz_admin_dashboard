"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDropdown() {
  const router = useRouter();
  const user = useAppSelector((state: any) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const logoutUser = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-full p-1 pr-3 transition-colors focus:outline-none">
          <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all">
            <AvatarImage src={user?.profilePhotoUrl as string} />
            <AvatarFallback className="bg-primary/10 text-primary overflow-hidden">
              {mounted ? (
                user?.name?.substring(0, 2)?.toUpperCase() || "AD"
              ) : (
                <Skeleton className="h-full w-full rounded-full" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start lg:flex">
            {mounted ? (
              <span className="text-primary-text text-sm leading-none font-semibold">
                {user?.name || "Admin"}
              </span>
            ) : (
              <Skeleton className="h-4 w-16" />
            )}
          </div>
          <ChevronDown className="text-secondary-text h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {mounted ? (
              <>
                <p className="text-primary-text truncate text-sm font-semibold">
                  {user?.name || "Admin"}
                </p>
                <p className="text-secondary-text truncate text-xs">
                  {user?.email || "admin@digitalsoftzone.com"}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-4 w-37.5 mb-1" />
                <Skeleton className="h-3 w-50" />
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-danger cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
