import { NextResponse } from 'next/server'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Directories
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /test-*/

# Resources
Allow: /api/og
Allow: /api/sitemap
Allow: /api/robots

# Sitemap
Sitemap: https://rioporto.com/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}