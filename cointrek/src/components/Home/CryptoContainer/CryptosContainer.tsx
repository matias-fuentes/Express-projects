import './CryptosContainer.css';
import { useState, FC } from 'react';
import { Crypto } from '../../../global.models';
import { ToolBar } from '..';
import {
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';
import { useAppSelector } from '../../../features';
import { CryptosWrapper } from '../../styled';
import { capitalizeFirstLetterOfEachWord } from '../../../util';
import { determineThemeBackground } from '../../../utilities/helpers';
import { Link } from 'react-router-dom';

export interface Props {
    cryptos: Crypto[];
}

export const CryptosContainer: FC<Props> = ({ cryptos }) => {
    const theme = useTheme();
    const itemsPerPage = 15;
    const [page, setPage] = useState(1);
    const user = useAppSelector(state => state.user.value);
    const [organizedCryptos, setOrganizedCryptos] = useState<Crypto[]>(cryptos);

    const paginatedCryptos = organizedCryptos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <CryptosWrapper>
            <ToolBar
                user={user}
                cryptos={cryptos}
                organizedCryptos={organizedCryptos}
                setOrganizedCryptos={setOrganizedCryptos}
            />
            <TableContainer
                component={Paper}
                className='px-5 shadow-none'
                style={{
                    background: determineThemeBackground(theme.palette.mode),
                }}
            >
                <Table>
                    <TableHead className={theme.palette.mode === 'dark' ? 'table__head' : 'table__head--light'}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>7d Change</TableCell>
                            <TableCell>24h Change</TableCell>
                            <TableCell>14d Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ backgroundColor: determineThemeBackground(theme.palette.mode) }}>
                        {paginatedCryptos.map(crypto => {
                            const { ticker, image, name, price, marketHistory } = crypto;
                            const { priceChangePercentage7d, priceChangePercentage24h, priceChangePercentage14d } =
                                marketHistory;
                            const cellClass =
                                'tCell d-block w-100 h-100 p-3 text-decoration-none d-flex align-items-center gap-3';

                            return (
                                <TableRow
                                    key={ticker}
                                    className={`cursor-pointer ${
                                        theme.palette.mode === 'dark' ? 'trow' : 'trow__light'
                                    }`}
                                >
                                    <TableCell className='p-0'>
                                        <Link to={`/cryptos/${name}`} className={cellClass}>
                                            <div className='d-flex align-items-center gap-3'>
                                                <img src={image} alt={name} width='30' height='30' />
                                                <p className='mb-0'>{ticker.toUpperCase()}</p>
                                                <p className='mb-0 text-secondary'>
                                                    {capitalizeFirstLetterOfEachWord(name.replaceAll('-', ' '))}
                                                </p>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className='p-0'>
                                        <Link to={`/cryptos/${name}`} className={cellClass}>
                                            ${price.toFixed(2)}
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        className={`p-0 ${
                                            priceChangePercentage7d.toString().includes('-')
                                                ? 'text-danger'
                                                : 'text-success'
                                        }`}
                                    >
                                        <Link to={`/cryptos/${name}`} className={cellClass}>
                                            {priceChangePercentage7d.toFixed(2)}%
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        className={`p-0 ${
                                            priceChangePercentage24h.toString().includes('-')
                                                ? 'text-danger'
                                                : 'text-success'
                                        }`}
                                    >
                                        <Link to={`/cryptos/${name}`} className={cellClass}>
                                            {priceChangePercentage24h.toFixed(2)}%
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        className={`p-0 ${
                                            priceChangePercentage14d.toString().includes('-')
                                                ? 'text-danger'
                                                : 'text-success'
                                        }`}
                                    >
                                        <Link to={`/cryptos/${name}`} className={cellClass}>
                                            {priceChangePercentage14d.toFixed(2)}%
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={Math.ceil(organizedCryptos.length / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{ flex: 1, padding: '10px 0' }}
            />
        </CryptosWrapper>
    );
};
