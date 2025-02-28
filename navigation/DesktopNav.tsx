"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, MapPin, Phone, LucideIcon } from 'lucide-react';
import { cuisines, aboutUsItems, locationItems, contactItems } from '@/config/nav-links';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    icon?: LucideIcon;
    title?: string;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-xs font-medium leading-none">
            {Icon && <Icon className="h-3 w-3" />}
            {title}
          </div>
          <div className="text-[10px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </a>
      </NavigationMenuLink>
    </motion.li>
  );
});
ListItem.displayName = "ListItem";

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-6">
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="gap-1 lg:gap-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xs lg:text-sm">Cuisines</NavigationMenuTrigger>
            <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col md:flex-row p-2 md:p-4 w-[95vw] max-w-[800px] max-h-[80vh] overflow-y-auto"
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-1 text-sm">
                  <AnimatePresence>
                    {cuisines.map((cuisine, index) => (
                      <motion.div
                        key={cuisine.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          title={cuisine.title}
                          href={cuisine.href}
                          icon={cuisine.icon}
                        >
                          {cuisine.description}
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ul>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full md:w-64 mt-3 md:mt-0 md:ml-4 lg:block hidden"
                >
                  <CloudinaryImage
                    src="/images/featured/cuisine.jpg"
                    alt="Featured cuisine"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xs lg:text-sm">About Us</NavigationMenuTrigger>
            <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col md:flex-row p-2 md:p-4 w-[95vw] max-w-[800px] max-h-[80vh] overflow-y-auto"
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-1">
                  <AnimatePresence>
                    {aboutUsItems.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ListItem
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                        >
                          {item.description}
                        </ListItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ul>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full md:w-64 mt-3 md:mt-0 md:ml-4 lg:block hidden"
                >
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
                    alt="Our facilities"
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xs lg:text-sm">
              <MapPin className="h-2 w-2 md:h-3 md:w-3 mr-1" />
              <span className="md:inline">Locations</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 p-2 md:p-4 w-[95vw] max-w-[1000px] max-h-[80vh] overflow-y-auto"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 flex-1">
                    <AnimatePresence>
                      {locationItems.map((location, index) => (
                        <motion.div
                          key={location.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            title={location.title}
                            href={location.href}
                            icon={location.icon}
                          >
                            <div className="space-y-1">
                              <p className="text-xs">{location.description}</p>
                              <div className="h-24 w-full rounded-md overflow-hidden">
                                <iframe
                                  src={location.mapUrl}
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  allowFullScreen
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                              </div>
                            </div>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full md:w-48 mt-2 md:mt-0 lg:block hidden"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60"
                      alt="Our locations"
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-xs lg:text-sm">
              <Phone className="h-2 w-2 md:h-3 md:w-3 mr-1" />
              <span className="md:inline">Contact</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="p-2 md:p-4 w-[95vw] md:w-[90vw] lg:w-[700px] max-h-[80vh] overflow-y-auto"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-1">
                    <AnimatePresence>
                      {contactItems.map((contact, index) => (
                        <motion.div
                          key={contact.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            title={contact.title}
                            href={contact.href}
                            icon={contact.icon}
                          >
                            <div className="space-y-1">
                              <p className="text-xs">{contact.description}</p>
                              <p className="font-medium text-primary text-xs">{contact.email}</p>
                            </div>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full md:w-40 mt-2 md:mt-0 lg:block hidden"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&auto=format&fit=crop&q=60"
                      alt="Contact us"
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center gap-1 md:gap-1 lg:gap-2 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
          <User className="h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
          <ShoppingBag className="h-4 w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
        </Button>
        <Button className="text-xs md:text-xs lg:text-sm px-2 md:px-2 lg:px-3 whitespace-nowrap">Order Now</Button>
      </div>
    </div>
  );
}