import { AdminDashboard } from '@/components/dashboard';
import { getAllSubdomains } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';
import {
  keepPreviousData,
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

const subdomainsQueryOptions = () =>
  queryOptions({
    queryKey: ['subdomains'],
    queryFn: () => getAllSubdomains(),
    placeholderData: keepPreviousData,
  });

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
  head: () => ({
    meta: [
      {
        title: `Admin Dashboard | ${rootDomain}`,
      },
      {
        name: 'description',
        content: `Manage subdomains for ${rootDomain}`,
      },
    ],
  }),
  beforeLoad: async (data) => {
    const subdomain = data.context.subdomain;
    if (subdomain) {
      throw redirect({
        to: '/',
      });
    }
  },

  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(subdomainsQueryOptions());
  },
});

function AdminPage() {
  const { data, refetch } = useSuspenseQuery(subdomainsQueryOptions());

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AdminDashboard
        tenants={data ?? []}
        onSetted={() => {
          refetch();
        }}
      />
    </div>
  );
}
