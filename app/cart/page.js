import { useCart } from '../../components/CartContext';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const response = await fetch('/api/stripe/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(item => ({ productId: item.id, quantity: item.quantity })) })
    });
    const { id } = await response.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-4">
          <p>{item.name} x <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-16" /></p>
          <p>${item.price / 100 * item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)} className="text-red-400">Remove</button>
        </div>
      ))}
      <p>Total: ${total / 100}</p>
      <button onClick={handleCheckout} className="bg-white text-black p-2 rounded">Checkout</button>
    </div>
  );
}