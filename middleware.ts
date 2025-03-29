import { withLngMiddleware } from './middleware/lng';
import { withAuthMiddleware } from './middleware/user';
import { chain } from './middleware/chain';

export default chain([withLngMiddleware,withAuthMiddleware])

export const config = {
  runtime:'nodejs',
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};


