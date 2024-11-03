import { queryOptions } from '@tanstack/react-query';

import { createQueryString } from '../utilities/create-query-string';
import { CoinGeckoResponse, CoinQueryType } from '../types/coingecko';
import { apiCall } from '../utilities/api-call';

export const REFRESH_INFO_INTERVAL = 5 * 60 * 1000;

export const coinQueryOptions = (cryptoID: string, queryObj?: CoinQueryType) =>
    queryOptions({
        queryKey: ['coins', { coinId: cryptoID }],
        queryFn: () => getCoinData(cryptoID, queryObj),
        placeholderData: data => data,
        refetchInterval: REFRESH_INFO_INTERVAL,
    });

export const getCoinData = async (id: string, queryObj?: CoinQueryType) => {
    const query = queryObj ? `?${createQueryString(queryObj)}` : '';
    return await apiCall<CoinGeckoResponse>(`https://api.coingecko.com/api/v3/coins/${id}${query}`, {
        method: 'GET',
        headers: { 'x-cg-demo-api-key': process.env.REACT_APP_VITE_COIN_GECKO_API_TOKEN ?? '' },
    });
};
