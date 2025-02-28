import type { Metadata } from "next";
import "@/app/globals.css";
import { MainNav } from "@/global/layout/Main-Nav";

export const metadata: Metadata = {
  title: "Order Now",
  description: "Food delivery and more",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}