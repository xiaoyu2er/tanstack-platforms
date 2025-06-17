import { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import NotFound from '@/components/not-found';
import { DefaultCatchBoundary } from '@/components/error';
// @ts-ignore
import appCss from '../globals.css?url';
import { extractSubdomain } from '@/lib/domain';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  subdomain: string | null;
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'TanStack Start Multi-Tenant Template' },
      {
        name: 'description',
        content: 'TanStack Start template for building a multi-tenant SaaS with custom subdomains.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  beforeLoad: async () => {
    const subdomain = await extractSubdomain();
    return {
      subdomain,
    };
  },
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
        <Scripts />
      </body>
    </html>
  );
}
