import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateSEOMetadata, articleSchema, breadcrumbSchema } from '@/components/SEO';
import { JsonLd } from '@/components/JsonLd';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BlogPost;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return generateSEOMetadata({
      title: 'Post não encontrado',
      description: 'O post que você está procurando não foi encontrado.',
      noindex: true,
    });
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: [...post.tags, 'bitcoin', 'criptomoedas', post.category],
    ogImage: post.image_url || 'https://rioporto.com/og-image.jpg',
    ogType: 'article',
    author: post.author,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    canonicalUrl: `https://rioporto.com/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = articleSchema({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    author: post.author,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    image: post.image_url || 'https://rioporto.com/og-image.jpg',
    url: `https://rioporto.com/blog/${post.slug}`,
  });

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://rioporto.com' },
    { name: 'Blog', url: 'https://rioporto.com/blog' },
    { name: post.title, url: `https://rioporto.com/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span>Por {post.author}</span>
            <span>•</span>
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </time>
            <span>•</span>
            <span className="capitalize">{post.category}</span>
          </div>
        </header>
        
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-auto rounded-lg mb-8"
          />
        )}
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}