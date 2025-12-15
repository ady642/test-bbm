import { create } from 'zustand';
import { PairToken } from '../models/PairToken';
import { Paginator } from '../models/Paginator';

interface SearchFilters {
  minLiquidity?: number;
  minVolume?: number;
  chainId?: string;
}

interface SearchState {
  searchQuery: string;
  filters: SearchFilters;
  pairs: PairToken[];
  paginator: Paginator<PairToken>;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setPairs: (pairs: PairToken[]) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  filters: {},
  pairs: [],
  paginator: new Paginator<PairToken>([], 12),

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilters: (filters: SearchFilters) => {
    set({ filters });
  },

  setPairs: (pairs: PairToken[]) => {
    const paginator = new Paginator<PairToken>(pairs, 12);
    set({ pairs, paginator });
  },

  nextPage: () => {
    const { paginator } = get();
    paginator.nextPage();
    set({ paginator: new Paginator(paginator['items'], paginator.getPageSize()) });
    get().paginator.goToPage(paginator.getCurrentPage());
  },

  previousPage: () => {
    const { paginator } = get();
    paginator.previousPage();
    set({ paginator: new Paginator(paginator['items'], paginator.getPageSize()) });
    get().paginator.goToPage(paginator.getCurrentPage());
  },

  goToPage: (page: number) => {
    const { paginator } = get();
    paginator.goToPage(page);
    set({ paginator: new Paginator(paginator['items'], paginator.getPageSize()) });
    get().paginator.goToPage(page);
  },

  resetFilters: () => {
    set({ filters: {} });
  },
}));
