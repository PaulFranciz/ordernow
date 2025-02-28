import React, { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';
import { aboutUsItems, locationItems, contactItems } from '@/config/nav-links';
import { 
  Menu, 
  ShoppingBag,
  MapPin, 
  Phone,
  ChevronDown,
  X,
  Search,
  Flame
} from 'lucide-react';

export function MobileNav() {
  const [sections, setSections] = useState<{ [key: string]: boolean }>({aboutUs: false, locations: false, contact: false});

  const toggleSection = (section: string) => {
    setSections(prev => ({...prev, [section]: !prev[section]}));
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-8 w-8" />
        </Button>
      </motion.div>
      
      <Sheet>
        <SheetTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="h-12 w-12">
              <Menu className="h-8 w-8" />
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[300px] sm:w-[380px] p-0 z-[100] border-l shadow-2xl bg-gradient-to-b from-neutral-900 to-black"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu with links to different sections, search, and ordering options
          </SheetDescription>
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-[#BF9B30]" />
              <span className="text-white font-bold tracking-tight">INFERNO</span>
            </div>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-white/10 bg-black/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input 
                placeholder="Search products..."
                className="w-full pl-10 bg-white/5 border-white/10 text-white text-base placeholder:text-white/50 focus-visible:ring-white/20 transition-colors"
                style={{ fontSize: 16 }}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)] w-full overflow-y-auto">
            <div className="flex flex-col gap-4 p-4 pb-8">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <Avatar className="h-10 w-10 ring-2 ring-white/10 ring-offset-2 ring-offset-black">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-xs text-white font-medium">GU</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Guest User</span>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-xs text-[#BF9B30] font-medium hover:text-red-300 transition-colors"
                  >
                    Sign in
                  </Button>
                </div>
              </div>

              {/* About Us Section */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('aboutUs')}
                  className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-white/5 group transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-[#BF9B30]">About Us</h3>
                  <div className="text-white/50 group-hover:text-white transition-colors">
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${sections.aboutUs ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {sections.aboutUs && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-1 pl-3 overflow-hidden"
                    >
                      {aboutUsItems.map(({ icon: Icon, title, href, description }, index) => (
                      <motion.div
                        key={href}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={href}
                          className="flex items-center gap-2 py-2 px-3 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200 hover:translate-x-1"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{title}</span>
                        </Link>
                      </motion.div>
                    ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Locations Section */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => toggleSection('locations')}
                  className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-white/5 group transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-[#BF9B30]">Locations</h3>
                  <div className="text-white/50 group-hover:text-white transition-colors">
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${sections.locations ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {sections.locations && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-1 pl-3 overflow-hidden"
                    >
                      {locationItems.map(({ icon: Icon, title, href, description }, index) => (
                        <motion.div
                          key={href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={href}
                            className="flex items-center gap-2 py-2 px-3 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200 hover:translate-x-1"
                          >
                            <Icon className="h-4 w-4" />
                            <span>{title}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Section */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => toggleSection('contact')}
                  className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-white/5 group transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-[#BF9B30]">Contact</h3>
                  <div className="text-white/50 group-hover:text-white transition-colors">
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${sections.contact ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {sections.contact && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-1 pl-3 overflow-hidden"
                    >
                      {contactItems.map(({ icon: Icon, title, href, description, email }, index) => (
                        <motion.div
                          key={href}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={href}
                            className="flex items-center gap-2 py-2 px-3 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200 hover:translate-x-1"
                          >
                            <Icon className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span>{title}</span>
                              <span className="text-[10px] text-white/50">{email}</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Button */}
              <Button 
                size="lg" 
                className="w-full mt-2 bg-[#BF9B30] hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg shadow-red-500/20 transition-all duration-200 hover:shadow-red-500/30"
              >
                Order Now
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}