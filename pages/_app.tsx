import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'lib/axios';
import type { AppProps } from 'next/dist/shared/lib/router/router';
import type { QueryMeta } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import '../styles/globals.css';

const Public = dynamic(() => import('components/Public'), {
  loading: () => null,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      async queryFn({ pageParam = 0, meta }) {
        const { url, returnKey, errorMessage, ...params } = meta as QueryMeta;

        try {
          const { data } = await axios.get(url as string, {
            params: {
              page: pageParam,
              ...params,
            },
          });

          return returnKey ? data[returnKey as string] : data;
        } catch (e) {
          if ((e as AxiosError).response?.status === 404 && errorMessage) {
            throw new Error(errorMessage as string);
          }

          throw new Error('Something went wrong.');
        }
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { isPrivate, ...props } = pageProps;

  queryClient.setMutationDefaults(['create'], {
    mutationFn: ({ url, data }) => axios.post(url, data),
  });

  queryClient.setMutationDefaults(['update'], {
    mutationFn: ({ url, data }) => axios.put(url, data),
  });

  queryClient.setMutationDefaults(['delete'], {
    mutationFn: ({ url }) => axios.delete(url),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}

      {isPrivate ? (
        <Component {...props} />
      ) : (
        <Public {...props}>
          <Component {...props} />
        </Public>
      )}
    </QueryClientProvider>
  );
}

export default MyApp;
