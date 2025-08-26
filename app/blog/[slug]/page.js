import { useBlogPost } from '../../../lib/hooks/useBlogPost';
import { useParams } from 'next/navigation';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

export default function BlogPostPage() {
  const params = useParams();
  const { post, loading } = useBlogPost(params.slug);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!post) return <div className="p-8">Post not found</div>;

  const shareUrl = window.location.href;
  const title = post.title;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-8">{post.publishedAt?.toLocaleDateString()}</p>
      <div className="prose prose-invert">
        {post.content}
      </div>
      <div className="mt-4">
        <FacebookShareButton url={shareUrl} quote={title}>
          Share on Facebook
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          Share on Twitter
        </TwitterShareButton>
      </div>
    </div>
  );
}