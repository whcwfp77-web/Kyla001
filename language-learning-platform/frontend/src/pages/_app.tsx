import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
