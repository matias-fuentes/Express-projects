import { FC } from 'react';

import { Price } from '../price/price';
import { cn } from '../../../utilities/cn';

type PriceChangeProps = {
    percentage?: number;
    priceChangeValue?: number;
    className?: string;
};

export const PriceChange: FC<PriceChangeProps> = ({ priceChangeValue, className, percentage = 0 }) => {
    const isDown = percentage < 0;
    const color = isDown ? 'text-danger' : 'text-success';

    if (priceChangeValue) {
        return (
            <span className={cn(color, className)}>
                <Price className={color} price={priceChangeValue} currency='' />
                {!!percentage && ` (${percentage.toFixed(2)}%)`}
            </span>
        );
    }

    if (!!percentage) {
        return <span className={cn(color, className)}>{`${percentage.toFixed(2)}%`}</span>;
    }

    return <></>;
};
