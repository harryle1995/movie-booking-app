// routes/payment.js
import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { quantity } = req.body;
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Movie Ticket',
            },
            unit_amount: 1000, // $10 in cents
          },
          quantity,
        },
      ],
      success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe checkout failed' });
  }
});

export default router;
