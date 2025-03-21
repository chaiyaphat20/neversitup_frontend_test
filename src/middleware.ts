import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { AppConfig } from './utils/Appconfig'

const publicPages = [
  '/',
  '/login',
  '/forgot-password',
  '/sign-up',
  '/reset-password/.*'
]
const intlMiddleware = createIntlMiddleware({
  locales:AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale:AppConfig.defaultLocale
})

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/login'
    }
  }
)

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(?:/(${AppConfig.locales.join('|')}))?(${publicPages.join('|')})?/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
