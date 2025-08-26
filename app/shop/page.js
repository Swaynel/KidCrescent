import { useProducts } from '../../lib/hooks/useProducts';
import { useCart } from '../../components/CartContext';
import Image from 'next/image';

export default function ShopPage() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-gray-900 p-4 rounded">
            <Image src={product.images[0]} alt={product.name} width={300} height={300} className="w-full h-auto" />
            <h3 className="font-bold">{product.name}</h3>
            <p>${product.price / 100}</p>
            <button onClick={() => addToCart(product)} className="bg-white text-black p-2 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}