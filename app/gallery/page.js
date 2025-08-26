import Image from 'next/image';
import { useGallery } from '../../lib/hooks/useGallery';

export default function GalleryPage() {
  const { gallery, loading } = useGallery();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gallery.map(item => (
          <div key={item.id}>
            <Image src={item.imageUrl} alt={item.altText} width={400} height={400} className="w-full h-auto rounded" />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}