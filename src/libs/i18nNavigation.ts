import { AppConfig } from '@/utils/Appconfig';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export type Locale = (typeof routing.locales)[number]
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)