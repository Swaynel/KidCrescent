import { Stripe } from 'stripe';
import { buffer } from 'micro';
import { addDoc, collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Timestamp } from '../../lib/firebase';
import { increment, arrayUnion } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await addDoc(collection(db, 'orders'), {
        userId: session.client_reference_id || 'guest',
        items: session.metadata.items ? JSON.parse(session.metadata.items) : [],
        total: session.amount_total,
        status: 'paid',
        createdAt: Timestamp.now(),
        shippingAddress: session.shipping_details
      });

      const items = session.metadata.items ? JSON.parse(session.metadata.items) : [];
      for (const item of items) {
        const productRef = doc(db, 'products', item.productId);
        await updateDoc(productRef, {
          inventory: increment(-item.quantity)
        });
        const product = (await getDoc(productRef)).data();
        if (product.category === 'music' && session.client_reference_id) {
          await updateDoc(doc(db, 'users', session.client_reference_id), {
            purchasedProducts: arrayUnion(item.productId)
          });
        }
      }
    } else if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      await updateDoc(doc(db, 'users', userId), {
        subscriptionTier: subscription.items.data[0].price.id === 'price_premium' ? 'premium' : 'basic'
      });
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}