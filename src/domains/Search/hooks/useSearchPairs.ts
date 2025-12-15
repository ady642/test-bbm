import { useQuery } from '@tanstack/react-query';
import { dexscreenerApi } from '../api/dexscreener.api';
import { PairToken } from '../models/PairToken';
import { useSearchStore } from '../store/searchStore';
import { useEffect } from 'react';

export const useSearchPairs = (query: string) => {
  const setPairs = useSearchStore((state) => state.setPairs);

  const queryResult = useQuery({
    queryKey: ['searchPairs', query],
    queryFn: () => dexscreenerApi.searchPairs(query),
    enabled: query.trim().length > 0,
    staleTime: 30000,
    retry: 2,
  });

  useEffect(() => {
    if (queryResult.data?.pairs) {
      const pairTokens = queryResult.data.pairs.map((pair) =>
        PairToken.fromDexScreener(pair)
      );
      setPairs(pairTokens);
    } else if (queryResult.data?.pairs === null) {
      setPairs([]);
    }
  }, [queryResult.data, setPairs]);

  return queryResult;
};
