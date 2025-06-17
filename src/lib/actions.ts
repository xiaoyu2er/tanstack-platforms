import { createServerFn } from '@tanstack/react-start';

import { redis } from '@/lib/redis';
import { isValidIcon } from '@/lib/subdomains';
import { rootDomain, protocol } from '@/lib/utils';

export const createSubdomainAction = createServerFn()
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    if (!formData.has('subdomain') || !formData.has('icon')) {
      throw new Error('Subdomain and icon are required');
    }
    return {
      subdomain: formData.get('subdomain')?.toString() || '',
      icon: formData.get('icon')?.toString() || '',
    };
  })
  .handler(async function ({ data: { subdomain, icon } }) {
    if (!subdomain || !icon) {
      return { success: false, error: 'Subdomain and icon are required' };
    }

    if (!isValidIcon(icon)) {
      return {
        subdomain,
        icon,
        success: false,
        error: 'Please enter a valid emoji (maximum 10 characters)',
      };
    }

    const sanitizedSubdomain = subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');

    if (sanitizedSubdomain !== subdomain) {
      return {
        subdomain,
        icon,
        success: false,
        error:
          'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.',
      };
    }

    const subdomainAlreadyExists = await redis.get(
      `subdomain:${sanitizedSubdomain}`
    );
    if (subdomainAlreadyExists) {
      return {
        subdomain,
        icon,
        success: false,
        error: 'This subdomain is already taken',
      };
    }

    await redis.set(`subdomain:${sanitizedSubdomain}`, {
      emoji: icon,
      createdAt: Date.now(),
    });

    return {
      success: true,
      next: `${protocol}://${sanitizedSubdomain}.${rootDomain}`,
    };
  });

export const deleteSubdomainAction = createServerFn()
  .validator((formData: FormData) => {
    if (!(formData instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    if (!formData.has('subdomain')) {
      throw new Error('Subdomain is required');
    }

    return {
      subdomain: formData.get('subdomain')?.toString() || '',
    };
  })
  .handler(async ({ data: { subdomain } }) => {
    try {
      await redis.del(`subdomain:${subdomain}`);
    } catch (e) {
      return {
        success: false,
        error: 'Failed to delete subdomain. Please try again later.',
      };
    }
    // revalidatePath('/admin');
    return { success: 'Domain deleted successfully' };
  });
