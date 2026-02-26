import { NextResponse } from 'next/server';

export function middleware(request) {
    const host = request.headers.get('host') || '';

    // Only run this logic if we are running in production (Vercel)
    if (process.env.NODE_ENV === 'production') {
        // If the request comes from a *.vercel.app domain
        // If the request comes from a www domain or vercel domain
        if (host.startsWith('www.') || host.endsWith('.vercel.app')) {
            // Redirect to the root domain
            const url = request.nextUrl.clone();
            url.hostname = 'na-coaching.com';
            url.port = ''; // Clear port just in case
            url.protocol = 'https';

            return NextResponse.redirect(url, 301); // 301 = Permanent Redirect
        }
    }

    return NextResponse.next();
}

// Ensure the middleware runs on all paths except internal Next.js paths and static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
