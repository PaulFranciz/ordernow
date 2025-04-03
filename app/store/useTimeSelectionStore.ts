import { create } from "zustand";
import { persist } from "zustand/middleware";

// Allowed order types
export type OrderType = "pick-up" | "dine-in" | "delivery";

interface TimeSelectionState {
  branchId: string | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  orderType: OrderType | null;
  setBranchId: (id: string | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setOrderType: (type: OrderType | null) => void;
  reset: () => void;
}

export const useTimeSelectionStore = create<TimeSelectionState>()(
  persist(
    (set) => ({
      branchId: null,
      selectedDate: null,
      selectedTime: null,
      orderType: null,
      setBranchId: (id) => set({ branchId: id }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setOrderType: (type) => set({ orderType: type }),
      reset: () => set({ branchId: null, selectedDate: null, selectedTime: null, orderType: null }),
    }),
    {
      name: "time-selection-storage",
      partialize: (state) => ({
        branchId: state.branchId,
        selectedDate: state.selectedDate ? state.selectedDate.toISOString() : null,
        selectedTime: state.selectedTime,
        orderType: state.orderType,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO string back to Date
          if (state.selectedDate && typeof state.selectedDate === "string") {
            state.selectedDate = new Date(state.selectedDate);
          }
        }
      },
    }
  )
);
