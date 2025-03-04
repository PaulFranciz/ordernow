import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AuthModal } from '@/components/auth/auth-modal';
import { useCart } from '@/hooks/useCart';

export function CartDrawer({ isAuthenticated = false }) {
  // Remove setIsOpen since we'll let the Sheet handle its own open state
  const { cart, total, addItem, removeItem } = useCart();
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // TODO: Proceed with checkout
      console.log("Proceeding to checkout with items:", cart);
    }
  };

  if (!mounted) {
    return null;
  }

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <motion.div 
            className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="p-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-800">
                  {totalItems} items
                </span>
                <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
                  Total: ₦{total.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </SheetTrigger>
        
        <SheetContent 
          side={isDesktop ? "right" : "bottom"} 
          className={`w-full ${isDesktop ? 'sm:max-w-md' : 'h-[80vh]'} flex flex-col`}
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              Your Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 flex flex-col min-h-0 mt-6">
            <ScrollArea className="flex-1 -mx-6 px-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="h-16 w-16 md:h-20 md:w-20 relative rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url || `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
                            alt={item.name}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
                            <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                          </div>
                          <p className="font-semibold text-primary text-sm md:text-base mt-1">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8"
                            onClick={() => removeItem(item.id)}
                          >
                            {item.quantity === 1 ? <X className="h-3 w-3 md:h-4 md:w-4" /> : <Minus className="h-3 w-3 md:h-4 md:w-4" />}
                          </Button>
                          <span className="w-6 md:w-8 text-center text-sm md:text-base">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 md:h-8 md:w-8"
                            onClick={() => addItem(item)}
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
            
            <div className="border-t mt-auto pt-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-semibold">Total</span>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
                  ₦{total.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SheetClose asChild>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
                <Button 
                  className="w-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white hover:shadow-lg 
                  transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}





// import React, { useEffect, useState } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { ShoppingCart, Plus, Minus, X } from "lucide-react";
// import { MenuItem } from '@/app/api/types';
// import { CloudinaryImage } from '@/components/ui/cloudinary-image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useMediaQuery } from '@/hooks/use-media-query';
// import { AuthModal } from '@/components/auth/auth-modal';

// interface CartDrawerProps {
//   cart: { [key: string]: number };
//   items: MenuItem[];
//   onAdd: (id: string) => void;
//   onRemove: (id: string) => void;
//   isAuthenticated?: boolean;
// }

// export function CartDrawer({ cart, items, onAdd, onRemove, isAuthenticated = false }: CartDrawerProps) {
//   const cartItems = items.filter(item => cart[item.id]);
//   const total = cartItems.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);
//   const isDesktop = useMediaQuery("(min-width: 768px)");
//   const [mounted, setMounted] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleCheckout = () => {
//     if (!isAuthenticated) {
//       setShowAuthModal(true);
//     } else {
//       // TODO: Proceed with checkout
//     }
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <>
//       <Sheet>
//         <SheetTrigger asChild>
//           <motion.div 
//             className="flex items-center gap-4 cursor-pointer"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <div className="p-2 rounded-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
//               <ShoppingCart className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <span className="text-lg font-semibold text-gray-800">
//                 {Object.values(cart).reduce((a, b) => a + b, 0)} items
//               </span>
//               <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
//                 Total: ₦{total.toLocaleString()}
//               </p>
//             </div>
//           </motion.div>
//         </SheetTrigger>
//         <SheetContent 
//           side={isDesktop ? "right" : "bottom"} 
//           className={`w-full ${isDesktop ? 'sm:max-w-md' : 'h-[80vh]'} flex flex-col`}
//         >
//           <SheetHeader className="flex-shrink-0">
//             <SheetTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
//               <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
//               Your Cart
//             </SheetTitle>
//           </SheetHeader>
          
//           <div className="flex-1 flex flex-col min-h-0 mt-6">
//             <ScrollArea className="flex-1 -mx-6 px-6">
//               {cartItems.length === 0 ? (
//                 <div className="text-center text-gray-500 py-6">
//                   Your cart is empty
//                 </div>
//               ) : (
//                 <div className="space-y-4 pb-4">
//                   <AnimatePresence mode="popLayout">
//                     {cartItems.map((item) => (
//                       <motion.div
//                         key={item.id}
//                         layout
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, x: -20 }}
//                         className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg"
//                       >
//                         <div className="h-16 w-16 md:h-20 md:w-20 relative rounded-lg overflow-hidden flex-shrink-0">
//                           <CloudinaryImage
//                             src={item.image_url || `https://placehold.co/400x300/1a1a1a/BF9B30/webp?text=${encodeURIComponent(item.name)}`}
//                             alt={item.name}
//                             width={80}
//                             height={80}
//                             className="object-cover h-full w-full"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
//                           <div>
//                             <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-1">{item.name}</h3>
//                             <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
//                           </div>
//                           <p className="font-semibold text-primary text-sm md:text-base mt-1">₦{item.price.toLocaleString()}</p>
//                         </div>
//                         <div className="flex items-center gap-1 md:gap-2">
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7 md:h-8 md:w-8"
//                             onClick={() => onRemove(item.id)}
//                           >
//                             {cart[item.id] === 1 ? <X className="h-3 w-3 md:h-4 md:w-4" /> : <Minus className="h-3 w-3 md:h-4 md:w-4" />}
//                           </Button>
//                           <span className="w-6 md:w-8 text-center text-sm md:text-base">{cart[item.id]}</span>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7 md:h-8 md:w-8"
//                             onClick={() => onAdd(item.id)}
//                           >
//                             <Plus className="h-3 w-3 md:h-4 md:w-4" />
//                           </Button>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               )}
//             </ScrollArea>
            
//             <div className="border-t mt-auto pt-4 flex-shrink-0">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-base font-semibold">Total</span>
//                 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BF9B30] to-[#DFBD69]">
//                   ₦{total.toLocaleString()}
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <SheetClose asChild>
//                   <Button 
//                     variant="outline"
//                     size="lg"
//                     className="w-full"
//                   >
//                     Continue Shopping
//                   </Button>
//                 </SheetClose>
//                 <Button 
//                   className="w-full bg-gradient-to-r from-[#BF9B30] to-[#DFBD69] text-white hover:shadow-lg 
//                   transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
//                   size="lg"
//                   onClick={handleCheckout}
//                 >
//                   Checkout
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>

//       <AuthModal 
//         isOpen={showAuthModal} 
//         onClose={() => setShowAuthModal(false)} 
//       />
//     </>
//   );
// } 