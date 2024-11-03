import './Crypto.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import parse, { DOMNode } from 'html-react-parser';

import { Chart } from '../components/chart';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CoinImage } from '../components/ui/coin-image';
import { Price } from '../components/ui/price';
import { PriceChange } from '../components/ui/price-change';
import { Section } from '../components/ui/section';

import { cn } from '../utilities/cn';
import { isDomElement } from '../utilities/is-dom-element';

import { coinQueryOptions } from './coin-query-options';
import { Link, useParams } from 'react-router-dom';
import { List, ListData } from './list';
import { CoinInfoType } from '../components/list-item/ListItem';
import { CoinGeckoResponse } from '../types/coingecko';
import { Button, useTheme } from '@mui/material';
import { PurchaseModal } from '../components/Home';
import { useAppSelector } from '../features';
import { numberWithCommas } from '../utilities/helpers';

export const Crypto = () => {
    const theme = useTheme();
    const user = useAppSelector(state => state.user.value);
    const { cryptoID } = useParams<{ cryptoID: string }>();
    const { data } = useSuspenseQuery(coinQueryOptions(cryptoID ?? ''));
    const cryptos = useAppSelector(state => state.cryptos.value);
    const currentCrypto = cryptos.find(crypto => crypto.name === cryptoID);

    if (!data || !currentCrypto) {
        return null;
    }

    const mainCoinInfo = getMainCoinInfo(data);
    const historyCoinInfo = getCoinHistoryInfo(data);
    const linksCoinInfo = getCoinLinks(data);

    return (
        <Section
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 ${theme.palette.mode} p-4 m-0 ${theme.palette.mode}__bg`}
        >
            <Card className='col-span-3'>
                <CardHeader className={cn('flex flex-row items-start gap-2 pb-2 flex-wrap')}>
                    <CoinImage src={data.image.large} alt={data.name} className='w-10 h-10 md:w-14 md:h-14' />
                    <CardTitle className='text-lg md:text-3xl inline mt-0'> {data.name}</CardTitle>
                    <span className='uppercase text-xs md:text-sm text-gray-400'>{data.symbol}</span>
                    {!!data.market_cap_rank && (
                        <Badge variant='secondary' className={`text-xs md:text-sm badge__${theme.palette.mode}`}>
                            {`#${data.market_cap_rank}`}
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    <Price price={currentCrypto.price} className='text-2xl md:text-4xl font-bold pr-2' />
                    <PriceChange
                        className='font-semibold text-xs md:text-base'
                        priceChangeValue={data.market_data.price_change_24h_in_currency?.usd ?? ''}
                        percentage={data.market_data.price_change_percentage_24h_in_currency?.usd ?? ''}
                    />

                    <Chart className='mt-4' />
                </CardContent>
            </Card>
            <Card className={`position-relative col-span-1 d-flex flex-column ${!user ? 'loginLayer' : ''}`}>
                <CardHeader>
                    <h3>Buy {currentCrypto.ticker.toUpperCase()}</h3>
                    <h4>${numberWithCommas(currentCrypto.price)} USD</h4>
                </CardHeader>
                <CardContent className='flex-grow-1'>
                    <PurchaseModal crypto={currentCrypto} user={user} />
                </CardContent>
                {!user && (
                    <div className='overlay-content d-flex flex-column align-items-center justify-content-center p-3 gap-3'>
                        <h3 className='text-center'>For buying {currentCrypto.ticker.toUpperCase()}, please login</h3>
                        <Link to='/login' className='w-75'>
                            <Button variant='contained' className='w-100' size='large'>
                                Login
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
            <List data={mainCoinInfo} type='value' className='col-span-full md:col-span-2' />
            <List data={historyCoinInfo} type='value' className='col-span-full md:col-span-2' />
            <List data={linksCoinInfo} type='links' className='col-span-full lg:col-span-2' />
            {data.description.en && (
                <Card className='col-span-2'>
                    <CardHeader className={cn('flex flex-row items-start gap-2 pb-2')}>
                        <CardTitle className='text-3xl inline mt-0'>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='whitespace-pre-wrap'>
                            {parse(data.description.en, {
                                replace(domNode: DOMNode) {
                                    if (isDomElement(domNode) && domNode.name === 'a') {
                                        domNode.attribs = {
                                            href: domNode.attribs.href,
                                            className: 'text-blue-500',
                                            target: '_blank',
                                            rel: 'noopener noreferrer',
                                        };
                                    }

                                    return domNode;
                                },
                            })}
                        </p>
                    </CardContent>
                </Card>
            )}
        </Section>
    );
};

export const getCoinLinks = (data: CoinGeckoResponse): ListData[] => [
    {
        label: 'Website',
        links: data.links.homepage,
        type: CoinInfoType.LINKS,
    },
    {
        label: 'Source Code',
        links: data.links.repos_url?.github,
        type: CoinInfoType.LINKS,
    },
    {
        label: 'Reddit',
        links: [data.links.subreddit_url],
        type: CoinInfoType.LINKS,
    },
    {
        label: 'Whitepaper',
        links: [data.links.whitepaper],
        type: CoinInfoType.LINKS,
    },
    {
        label: 'Telegram',
        links: [data.links.telegram_channel_identifier && `https://t.me/${data.links.telegram_channel_identifier}`],
        type: CoinInfoType.LINKS,
    },
];

export const getCoinHistoryInfo = (data: CoinGeckoResponse): ListData[] => [
    {
        label: '24h Range',
        value: [data.market_data.low_24h?.usd ?? '', data.market_data.high_24h?.usd ?? ''],
        type: CoinInfoType.PRICE,
    },
    {
        label: 'All-Time High',
        value: [data.market_data.ath?.usd ?? ''],
        type: CoinInfoType.PRICE,
    },
    {
        label: 'All-Time Low',
        value: [data.market_data.atl?.usd ?? ''],
        type: CoinInfoType.PRICE,
    },
];

export const getMainCoinInfo = (data: CoinGeckoResponse): ListData[] => [
    {
        label: 'Market Cap',
        value: [data.market_data.market_cap.usd ?? ''],
        type: CoinInfoType.PRICE,
    },
    {
        label: '24 Hour Trading Vol',
        value: [data.market_data.total_volume?.usd ?? ''],
        type: CoinInfoType.PRICE,
    },
    {
        label: 'Circulating Supply',
        value: [data.market_data.circulating_supply ?? ''],
        type: CoinInfoType.NUMBER,
    },
    {
        label: 'Total Supply',
        value: [data.market_data.total_supply ?? ''],
        type: CoinInfoType.NUMBER,
    },
    {
        label: 'Max Supply',
        value: [data.market_data.max_supply ?? ''],
        type: CoinInfoType.NUMBER,
    },
];
