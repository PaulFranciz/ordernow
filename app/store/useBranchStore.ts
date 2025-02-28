import { create } from 'zustand';
import { Branch } from '@/app/api/types';
import { BRANCHES } from '@/lib/constants/branches';

interface BranchState {
  branches: Branch[];
  selectedBranchId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchBranches: () => void;
  selectBranch: (branchId: string) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  branches: [],
  selectedBranchId: null,
  isLoading: false,
  error: null,

  fetchBranches: () => {
    set({ isLoading: true, error: null });
    try {
      // Use static data instead of API call
      set({ 
        branches: BRANCHES,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load branches',
        isLoading: false 
      });
    }
  },

  selectBranch: (branchId: string) => {
    set({ selectedBranchId: branchId });
  },
}));