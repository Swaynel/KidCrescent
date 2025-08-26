import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body; // assume from auth
      const user = (await getDoc(doc(db, 'users', userId))).data();
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId, // assume stored
        return_url: `${req.headers.origin}/profile`,
      });
      res.json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}