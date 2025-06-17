import { redis } from '@/lib/redis';
import { createServerFn } from '@tanstack/react-start';

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn(
      'Emoji regex validation failed, using fallback validation',
      error
    );
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10;
}

export type SubdomainData = {
  emoji: string;
  createdAt: number;
  subdomain: string;
};

export const getSubdomainData = createServerFn()
  .validator((subdomain: string) => subdomain)
  .handler(async ({ data: subdomain }) => {
    const sanitizedSubdomain = subdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    const data = await redis.get<SubdomainData>(
      `subdomain:${sanitizedSubdomain}`
    );
    if (!data) return null;

    return {
      ...data,
      subdomain,
    };
  });

export const getAllSubdomains = createServerFn().handler(async function () {
  console.log('Fetching all subdomains from Redis');
  const keys = await redis.keys('subdomain:*');

  if (!keys.length) {
    return [];
  }

  const values = await redis.mget<SubdomainData[]>(...keys);

  return keys.map((key, index) => {
    const subdomain = key.replace('subdomain:', '');
    const data = values[index];

    return {
      subdomain,
      emoji: data?.emoji || '❓',
      createdAt: data?.createdAt || Date.now(),
    };
  });
});
