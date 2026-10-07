"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import RightSection from "./_components/RightSection/RightSection";
import { useEffect, useState } from "react";

export default function NavigationBar() {
  const user = useAppSelector((state: any) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else if (hour >= 21 || hour < 5) {
      setGreeting("Good Night");
    }
  }, []);

  const name = user?.name || "Guest";

  return (
    <header className="border-border bg-card sticky top-0 z-50 flex w-full shrink-0 items-center border-b px-4 py-3 lg:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary hover:text-primary bg-primary/10 hover:bg-primary/20 h-9 w-9 cursor-pointer rounded-sm transition-colors" />
          <div className="text-primary-text hidden text-lg font-medium md:block">
            {mounted ? (
              <>
                {greeting}, <span className="font-semibold">{name}</span>
              </>
            ) : (
              <Skeleton className="h-6 w-50" />
            )}
          </div>
        </div>

        {/* Right */}
        <RightSection />
      </div>
    </header>
  );
}
