"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, ShoppingBag, Truck } from "lucide-react";
import { OrderType, useTimeSelectionStore } from "@/app/store/useTimeSelectionStore";

const orderTypes = [
  {
    id: "dine-in",
    title: "Dine In",
    description: "Enjoy your meal in our restaurant",
    icon: UtensilsCrossed,
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "pick-up",
    title: "Pick Up",
    description: "Order ahead and pick up at your convenience",
    icon: ShoppingBag,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "Get your favorite meals delivered to your doorstep",
    icon: Truck,
    color: "from-blue-500 to-indigo-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function OrderTypePage() {
  const router = useRouter();

  const handleOrderTypeSelect = (type: typeof orderTypes[number]) => {
    // Save the order type in Zustand using its id (a string)
    useTimeSelectionStore.getState().setOrderType(type.id as OrderType);
    // Navigate using the order type id
    router.push(`/order/${type.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-grid-white/[0.2]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How would you like to order?
          </h1>
          <p className="text-lg text-neutral-400">
            Choose your preferred way to enjoy our delicious meals
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {orderTypes.map((type) => (
            <motion.div
              key={type.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOrderTypeSelect(type)}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
              <div className={`relative h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition-all duration-300 group-hover:border-neutral-700 overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="mb-4">
                    <type.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{type.title}</h3>
                  <p className="text-neutral-400">{type.description}</p>
                  <div className="mt-6 flex items-center text-sm text-neutral-400 group-hover:text-white transition-colors duration-300">
                    <span>Get started</span>
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
