// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import cloudflare from '@astrojs/cloudflare';

/** Confirmed public production origin, used when `SITE_URL` is unset or blank. */
const DEFAULT_SITE_URL = 'https://unakaya.work';

/**
 * Optional build-time override for alternate hosts, read from the shell / CI
 * environment or a local `.env` file. Validated by `resolveSiteUrl`.
 */
const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/**
 * @param {string | undefined} value
 * @returns {string}
 */
function resolveSiteUrl(value) {
  const raw = value?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  /** @type {URL} */
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`[site] SITE_URL is not a valid absolute URL: "${raw}"`);
  }

  const host = url.hostname.toLowerCase();
  const problems = [];
  if (url.protocol !== 'https:') problems.push('must use https://');
  if (url.username || url.password) problems.push('must not contain credentials');
  if (url.pathname !== '/' || url.search || url.hash) {
    problems.push('must be an origin only (no path, query, or hash)');
  }
  if (/(^|\.)example\.(com|net|org)$/.test(host)) problems.push('must not be a placeholder domain');
  if (host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0' || host.startsWith('127.') || host === '[::1]') {
    problems.push('must not be a local address');
  }
  if (problems.length) {
    throw new Error(`[site] Invalid SITE_URL "${raw}": ${problems.join('; ')}.`);
  }

  return url.origin;
}

// https://astro.build/config
export default defineConfig({
  site: resolveSiteUrl(SITE_URL),
  integrations: [mdx(), sitemap()],
  adapter: cloudflare(),
});
