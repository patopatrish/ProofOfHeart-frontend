import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match the root, all localized paths, and bare /causes/* so the
  // next-intl middleware can redirect non-localized cause URLs.
  matcher: ["/", "/(es|en)/:path*", "/causes/:path+"],
};
