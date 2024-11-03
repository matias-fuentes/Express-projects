import './ListItem.css';
import { FC, Fragment } from 'react';

import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Price } from '../ui/price';
import { useTheme } from '@mui/material';

export enum CoinInfoType {
    PRICE = 'price',
    NUMBER = 'number',
    ARRAY = 'array',
    LINKS = 'links',
}

type ListItemProps = {
    label: string;
    value?: Array<number | string>;
    links?: Array<string>;
    type: CoinInfoType;
};

export const ListItem: FC<ListItemProps> = ({ label, value, links, type }) => {
    const theme = useTheme();
    const linksToRender = links
        ?.filter(link => !!link && typeof link === 'string')
        .map(link => {
            const linkLabel = link.split('/')[2]?.replace('www.', '');

            return (
                <Badge key={link} className={`text-card badge__${theme.palette.mode}`}>
                    <a href={link} target='_blank' rel='noreferrer'>
                        {linkLabel}
                    </a>
                </Badge>
            );
        });

    return (
        <>
            <div className='col-span-1 font-medium text-card-foreground'>{label}</div>
            <div className={`col-span-2 text-card-foreground text-right break-all`}>
                {value?.map((item, index, array) => (
                    <Fragment key={item}>
                        {type === CoinInfoType.PRICE && <Price price={item} />}
                        {type === CoinInfoType.NUMBER && value?.toLocaleString()}
                        {array.length - 1 !== index && ' - '}
                    </Fragment>
                ))}
                {!!linksToRender?.length && (
                    <div className='col-span-1 text-card-foreground text-right flex gap-2 justify-end flex-wrap'>
                        {linksToRender}
                    </div>
                )}
            </div>
            <Separator className='col-span-3  last:hidden' />
        </>
    );
};
