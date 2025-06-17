import { rootDomain } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { SubdomainForm } from './subdomain-form';
import { GitHubLink } from './github-link';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="absolute top-4 left-4">
        <GitHubLink />
      </div>
      <div className="absolute top-4 right-4">
        <Link
          to="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Create your own subdomain with a custom emoji
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <SubdomainForm />
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          Built with{' '}
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            TanStack Start
          </a>
          {' '}• Hosted on{' '}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Vercel
          </a>
        </div>
      </div>
    </div>
  );
}
