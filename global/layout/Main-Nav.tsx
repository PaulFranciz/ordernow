"use client";

import React from 'react';
import Link from 'next/link';
import { DesktopNav } from '@/navigation/DesktopNav';
import { MobileNav } from '@/navigation/MobileNav';
import { Utensils } from 'lucide-react';

export function MainNav() {
  return (
    <header className="fixed top-0 z-[100] mx-auto mt-4 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[65%] max-w-[1200px] rounded-full bg-background/75 backdrop-blur-lg shadow-lg">
      <div className="container flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="text-sm">OrderNow</span>
          </Link>
        </div>
        
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}

export default MainNav;