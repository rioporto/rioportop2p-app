import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  const supabase = createClient();
  const baseUrl = 'https://rioporto.com';

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/cotacao-p2p', changefreq: 'hourly', priority: 0.9 },
    { url: '/blog', changefreq: 'daily', priority: 0.8 },
    { url: '/cursos', changefreq: 'weekly', priority: 0.7 },
    { url: '/faq', changefreq: 'weekly', priority: 0.7 },
    { url: '/contato', changefreq: 'monthly', priority: 0.6 },
    { url: '/otc', changefreq: 'weekly', priority: 0.7 },
    { url: '/login', changefreq: 'monthly', priority: 0.5 },
    { url: '/signup', changefreq: 'monthly', priority: 0.5 },
    { url: '/termos-de-uso', changefreq: 'monthly', priority: 0.4 },
    { url: '/politica-de-privacidade', changefreq: 'monthly', priority: 0.4 },
    { url: '/status', changefreq: 'daily', priority: 0.6 },
  ];

  // Dynamic pages - fetch from database
  let blogPosts: any[] = [];
  let courses: any[] = [];

  try {
    // Fetch blog posts
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (posts) {
      blogPosts = posts.map(post => ({
        url: `/blog/${post.slug}`,
        lastmod: new Date(post.updated_at).toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      }));
    }

    // Fetch courses
    const { data: courseData } = await supabase
      .from('courses')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (courseData) {
      courses = courseData.map(course => ({
        url: `/cursos/${course.slug}`,
        lastmod: new Date(course.updated_at).toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  // Combine all pages
  const allPages = [...staticPages, ...blogPosts, ...courses];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority || 0.5}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}