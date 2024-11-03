import { determineThemeBackground } from '../utilities/helpers';
import { useAppSelector } from '../features';
import { useTheme } from '@mui/material/styles';
import { CryptosContainer } from '../components/Home';
import { LoadingUx } from '../components';
import { HomeWrapper } from '../components/styled';

export const Home = () => {
    const newsArticles = useAppSelector(state => state.newsArticles.value);
    const cryptos = useAppSelector(state => state.cryptos.value);
    const theme = useTheme();

    return (
        <HomeWrapper
            className='px-5'
            style={{
                backgroundColor: `${determineThemeBackground(theme.palette.mode)}`,
            }}
        >
            <CryptosContainer cryptos={cryptos} />
            {/* Will provide a loading icon while app is fetching cryptos or news from server */}
            {(!cryptos.length || !newsArticles.length) && <LoadingUx />}
        </HomeWrapper>
    );
};
