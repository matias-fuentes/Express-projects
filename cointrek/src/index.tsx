import './index.css';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { RouteSwitch } from './RouteSwitch';
import { GlobalCryptoProvider } from './context';
import { Provider } from 'react-redux';
import { store } from './features/store';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import "@radix-ui/themes/styles.css";

// Import the generated route tree

import './index.css';

dayjs.extend(relativeTime);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 6000,
            refetchOnWindowFocus: false,
        },
    },
});

const router = createRouter({
    defaultPreload: false,
    context: { queryClient },
    defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // Provides access to our redux store to all nested children components.
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            {/* Context API that manages page overlapping UI components */}
            <GlobalCryptoProvider>
                <RouteSwitch />
                {/* <RouterProvider router={router} /> */}
            </GlobalCryptoProvider>
        </Provider>
    </QueryClientProvider>
);
