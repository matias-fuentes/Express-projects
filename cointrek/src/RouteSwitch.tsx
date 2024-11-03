import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home, Login, Welcome, News } from './routes';
import { LoadingUx, OnlyUnauthenticated } from './components';
import { Navbar } from './components/Navbar';
import { ThemeContext } from './context';
import { useFetchNewsArticles, useFetchCryptos, useManageUser } from './hooks';
import { Crypto } from './routes/Crypto';
import { Suspense } from 'react';

export const RouteSwitch = () => {
    // Hooks that will manage redux store values based on app changes.
    useFetchNewsArticles();
    useFetchCryptos();
    useManageUser();

    return (
        <ThemeContext>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Welcome />} />
                    <Route path='/cryptos' element={<Home />} />
                    <Route path='/news' element={<News />} />
                    <Route
                        path='/login'
                        element={
                            // Prevent users that are logged in to access this route.
                            <OnlyUnauthenticated>
                                <Login />
                            </OnlyUnauthenticated>
                        }
                    />
                    {/* Redirect all users navigating to invalid pages, back into our welcome page. */}
                    <Route
                        path='/cryptos/:cryptoID'
                        element={
                            <Suspense fallback={<LoadingUx />}>
                                <Crypto />
                            </Suspense>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeContext>
    );
};
