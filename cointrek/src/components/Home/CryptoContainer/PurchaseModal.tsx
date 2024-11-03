import { FC, useState } from 'react';
import { Box } from '@mui/material';
import { Crypto } from '../../../global.models';
import { SyntheticEvent } from 'react';
import { Button, TextField, Alert } from '@mui/material';
import { useGlobalContext, ResponseType } from '../../../context';
import { formatPrice, numberWithCommas, getUserQuantityOwned } from '../../../utilities/helpers';
import { purchaseCrypto } from '../../../api/api';
import { User, Error } from '../../../global.models';
import { useAppDispatch, setUser } from '../../../features';
import { PurchaseCryptoFormWrapper } from '../../styled';

interface Props {
    crypto: Crypto;
    user: User | null;
}

export const PurchaseModal: FC<Props> = ({ crypto, user }) => {
    const { togglePageLoading, handleBannerMessage } = useGlobalContext();

    const dispatch = useAppDispatch();

    const [usdValue, setUsdValue] = useState<number>(crypto.price);
    const [cryptoQuantity, setCryptoQuantity] = useState<number>(1);
    const [error, setError] = useState<Error>({ exists: false });

    let ownedQuantity = getUserQuantityOwned(user ? user.portfolio : [], crypto.name);

    const handlePurchase = async (event: SyntheticEvent) => {
        event.preventDefault();
        togglePageLoading();

        if (usdValue === 0) {
            setError({
                exists: true,
                message: 'Please enter quantity greater than zero',
            });
            togglePageLoading();
        } else {
            try {
                const user: User = await purchaseCrypto(crypto.name, cryptoQuantity);
                dispatch(setUser(user));

                togglePageLoading();
                handleBannerMessage(
                    ResponseType.Success,
                    `Purchased ${numberWithCommas(cryptoQuantity)} ${crypto.ticker.toUpperCase()} coin${
                        cryptoQuantity > 1 ? 's' : ''
                    }`
                );
            } catch (error) {
                setError({ exists: true, message: error.response.data.message });
                togglePageLoading();
            }
        }
    };

    const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let usd = parseFloat(e.target.value);
        usd = parseFloat(usd.toFixed(5));
        setUsdValue(usd);
        setCryptoQuantity(parseFloat((usd / crypto.price).toFixed(5)));
    };

    const handleCryptoQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let quantity = parseFloat(e.target.value);
        quantity = parseFloat(quantity.toFixed(5));
        setCryptoQuantity(quantity);
        setUsdValue(parseFloat((quantity * crypto.price).toFixed(5)));
    };

    return (
        <Box className='h-100'>
            <PurchaseCryptoFormWrapper className='h-100'>
                <form
                    onSubmit={handlePurchase}
                    className='h-100 d-flex flex-column justify-content-between gap-3 position-relative'
                >
                    {/* Overview of crypto price details, along with the account balance of user. */}
                    <div>
                        <p className='text-secondary'>Balance</p>
                        <div className='w-100'>
                            <p>
                                {crypto.ticker.toUpperCase()} Balance:
                                {` ${ownedQuantity} ${crypto.ticker.toUpperCase()}`}
                                {ownedQuantity > 1 ? 's' : ''}
                            </p>
                            {user?.balance && (
                                <p>Cash Balance: ${user.balance && numberWithCommas(formatPrice(user.balance))}</p>
                            )}
                        </div>
                    </div>

                    <div className='d-flex flex-column gap-3'>
                        <div className='checkoutDetails'>
                            <TextField
                                className='quantityInput w-100'
                                id='usd-input'
                                label='USD'
                                type='number'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: { min: crypto.price, step: 1 },
                                }}
                                value={isNaN(usdValue) ? '' : usdValue}
                                onChange={handleUsdChange}
                                required
                            />
                        </div>
                        <div className='checkoutDetails'>
                            <TextField
                                className='quantityInput w-100'
                                id='crypto-quantity-input'
                                label={crypto.ticker.toUpperCase()}
                                type='number'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: { min: 1, step: 1 },
                                }}
                                value={isNaN(cryptoQuantity) ? '' : cryptoQuantity}
                                onChange={handleCryptoQuantityChange}
                                required
                            />

                            <p className='totalCalculation text-secondary'>
                                Total: ${isNaN(usdValue) ? 0 : numberWithCommas(usdValue)}
                            </p>
                        </div>
                    </div>

                    <Button
                        type='submit'
                        className={`purchaseBtn bg-success ${
                            !!user?.balance && user?.balance < usdValue ? 'purchaseBtn__disabled' : ''
                        }`}
                        disabled={!!user?.balance && user?.balance < usdValue}
                    >
                        Confirm Purchase
                    </Button>
                    {/* Error feedback */}
                    {error.exists && (
                        <Alert severity='error' sx={{ marginTop: '10px', padding: '0 5px' }}>
                            {error.message}
                        </Alert>
                    )}
                </form>
            </PurchaseCryptoFormWrapper>
        </Box>
    );
};
