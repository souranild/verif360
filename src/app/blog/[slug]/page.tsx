import { fetchBlogs } from '@/lib/data';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface BlogPageProps {
  params: { slug: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blogs = await fetchBlogs();
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted">
      <Navigation />
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground">{blog.title}</h1>
            <p className="text-lg text-muted-foreground mb-2">By {blog.author}</p>
            <p className="text-sm text-muted-foreground">{new Date(blog.date).toLocaleDateString()}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div
            className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  );
}