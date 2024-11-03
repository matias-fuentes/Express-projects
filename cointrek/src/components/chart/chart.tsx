import { FC, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createChart, UTCTimestamp, DeepPartial, ChartOptions } from 'lightweight-charts';
import { CandlestickChart, LineChart } from 'lucide-react';

import { ChartType, daysOptions } from './constants';

import { cn } from '../../utilities/cn';
import { Blocker } from '../ui/blocker';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

import { getBaseLineOptions, getCandlestickOptions, getChartOptions } from './chart-utils';
import { useMatchMedia } from './use-match-media';

import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { createQueryString } from '../../utilities/create-query-string';
import { apiCall } from '../../utilities/api-call';

const DEFAULT_OHLC_DAYS = 1;
const REFRESH_INFO_INTERVAL = 5 * 60 * 1000;
const SEC_IN_MS = 1000;

type ChartProps = {
    className?: string;
};

export const Chart: FC<ChartProps> = ({ className }) => {
    const { cryptoID } = useParams<{ cryptoID: string }>();
    const chartRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();
    const [days, setDays] = useState(DEFAULT_OHLC_DAYS);
    const [chartType, setChartType] = useState<ChartType>(ChartType.Line);

    const isDesktop = useMatchMedia('(min-width: 768px)');

    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['ohlc', cryptoID, days],
        queryFn: () => getCoinOHLC({ vs_currency: 'usd', id: cryptoID ?? '', days }),
        placeholderData: prevData => prevData,
        refetchInterval: REFRESH_INFO_INTERVAL,
    });

    const handleChangeDays = (value: string) => {
        setDays(Number(value) || DEFAULT_OHLC_DAYS);
    };

    const handleChangeChartType = (value: ChartType) => {
        setChartType(value);
    };

    useEffect(() => {
        if (chartRef.current && !!data?.length) {
            const chartOptions: DeepPartial<ChartOptions> = getChartOptions(chartType, isDesktop);
            const chart = createChart(chartRef.current, chartOptions);
            const basePrice = data?.[0]?.[4] ?? 0;

            if (chartType === ChartType.Line) {
                const baselineSeries = chart.addBaselineSeries(getBaseLineOptions(basePrice, isDesktop));
                baselineSeries.setData(
                    data.map(([time, , , , close]) => ({
                        time: (time / SEC_IN_MS) as UTCTimestamp,
                        value: close,
                    }))
                );
            } else {
                const candlestickSeries = chart.addCandlestickSeries(getCandlestickOptions(basePrice));
                candlestickSeries.setData(
                    data.map(([time, open, high, low, close]) => ({
                        time: (time / SEC_IN_MS) as UTCTimestamp,
                        close,
                        high,
                        low,
                        open,
                    }))
                );
            }

            chart.timeScale().fitContent();

            return () => {
                chart.remove();
            };
        }
    }, [data, theme, chartType, isDesktop]);

    if (!data?.length && !isFetching && !isLoading) {
        return null;
    }

    return (
        <div className={cn('relative', className)}>
            <Blocker isLoading={isFetching || isLoading} />
            <div className='flex flex-wrap justify-center md:justify-end gap-2'>
                <ToggleGroup
                    type='single'
                    className='rounded-md bg-input p-1 hidden md:flex'
                    value={chartType}
                    onValueChange={handleChangeChartType}
                >
                    <ToggleGroupItem value={ChartType.Line} aria-label='line' size='2sm'>
                        <LineChart size={16} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value={ChartType.Candlestick} aria-label='candlestick chart' size='2sm'>
                        <CandlestickChart size={16} />
                    </ToggleGroupItem>
                </ToggleGroup>

                <ToggleGroup
                    type='single'
                    className='rounded-md bg-input p-1 md:mr-6'
                    value={days.toString()}
                    onValueChange={handleChangeDays}
                >
                    {daysOptions.map(day => (
                        <ToggleGroupItem key={day.value} value={day.value.toString()} aria-label={day.label} size='2sm'>
                            {day.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            <div
                ref={chartRef}
                className={cn(' flex items-center w-full, h-[250px] md:h-[380px] overflow-hidden mt-6')}
            />
        </div>
    );
};

type GetCoinOHLCType = {
    id: string;
    vs_currency: Currencies;
    days: number;
    precision?: 'full' | number;
};

const getCoinOHLC = async ({ id, ...queryObj }: GetCoinOHLCType) => {
    const query = queryObj ? `?${createQueryString(queryObj)}` : '';
    return await apiCall<GetOHLCResponse>(`https://api.coingecko.com/api/v3/coins/${id}/ohlc${query}`, {
        method: 'GET',
        headers: { 'x-cg-demo-api-key': process.env.REACT_APP_VITE_COIN_GECKO_API_TOKEN ?? '' },
    });
};

type Currencies =
    | 'aed'
    | 'ars'
    | 'aud'
    | 'bch'
    | 'bdt'
    | 'bhd'
    | 'bmd'
    | 'bnb'
    | 'brl'
    | 'btc'
    | 'cad'
    | 'chf'
    | 'clp'
    | 'cny'
    | 'czk'
    | 'dkk'
    | 'dot'
    | 'eos'
    | 'eth'
    | 'eur'
    | 'gbp'
    | 'gel'
    | 'hkd'
    | 'huf'
    | 'idr'
    | 'ils'
    | 'inr'
    | 'jpy'
    | 'krw'
    | 'kwd'
    | 'lkr'
    | 'ltc'
    | 'mmk'
    | 'mxn'
    | 'myr'
    | 'ngn'
    | 'nok'
    | 'nzd'
    | 'php'
    | 'pkr'
    | 'pln'
    | 'rub'
    | 'sar'
    | 'sek'
    | 'sgd'
    | 'thb'
    | 'try'
    | 'twd'
    | 'uah'
    | 'usd'
    | 'vef'
    | 'vnd'
    | 'xag'
    | 'xau'
    | 'xdr'
    | 'xlm'
    | 'xrp'
    | 'yfi'
    | 'zar'
    | 'bits'
    | 'link'
    | 'sats';

type GetOHLCResponse = Array<[number, number, number, number, number]>;
