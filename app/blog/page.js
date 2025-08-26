import { useBlog } from '../../lib/hooks/useBlog';
import Link from 'next/link';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

export default function BlogPage() {
  const { blog, loading } = useBlog();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {blog.map(post => (
        <div key={post.id} className="mb-8">
          <Link href={`/blog/${post.slug}`} className="text-xl font-bold hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-400">{post.publishedAt?.toLocaleDateString()}</p>
          <p>{post.excerpt}</p>
          <div>
            <FacebookShareButton url={window.location.href + post.slug} quote={post.title}>
              Share on Facebook
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href + post.slug} title={post.title}>
              Share on Twitter
            </TwitterShareButton>
          </div>
        </div>
      ))}
    </div>
  );
}