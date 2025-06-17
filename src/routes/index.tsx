import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { HomePage } from '@/components/home-page';
import { SubdomainPage } from '@/components/subdomain-page';
import { getSubdomainData } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';

export const Route = createFileRoute('/')({
  loader: async (data) => {
    const subdomain = data.context.subdomain;
    if (subdomain) {
      const subdomainData = await getSubdomainData({ data: subdomain });
      if (!subdomainData) {
        throw notFound();
      }
      return {
        subdomain,
        subdomainData,
      };
    }
    return {
      subdomain,
    };
  },
  head: (ctx) => {
    const subdomain = ctx.loaderData?.subdomain;
    if (subdomain) {
      return {
        meta: [
          { title: `${subdomain}.${rootDomain}` },
          {
            name: 'description',
            content: `Subdomain page for ${subdomain}.${rootDomain}`,
          },
        ],
      };
    } else {
      return {};
    }
  },
  component: IndexPage,
});

function IndexPage() {
  const { subdomain, subdomainData } = Route.useLoaderData();
  if (subdomain && subdomainData) {
    return <SubdomainPage subdomainData={subdomainData} />;
  } else {
    return <HomePage />;
  }
}
