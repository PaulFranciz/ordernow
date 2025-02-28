"use client";

import React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { BranchSelector } from "@/components/order/branch-selector";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderType = params.type as string;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-grid-white/[0.2]">
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-center">
            {orderType === "dine-in" && "Select a Branch to Dine In"}
            {orderType === "pick-up" && "Choose Your Pickup Location"}
            {orderType === "delivery" && "Select a Branch for Delivery"}
          </h1>

          <BranchSelector orderType={orderType} />
        </motion.div>
      </div>
    </div>
  );
}