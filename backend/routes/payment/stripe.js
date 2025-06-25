// backend/routes/payment/stripe.js

import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

import { insertBooking } from "../../db/booking.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================
// GET CHECKOUT SESSION BY ID
// ==========================
router.get("/session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (err) {
    console.error("Error fetching Stripe session:", err.message);
    res.status(500).json({ error: "Failed to retrieve session." });
  }
});

// ==========================
// CREATE CHECKOUT SESSION
// ==========================
router.post("/create-payment-intent", async (req, res) => {
  const { userId, showtimeId, selectedSeats } = req.body;

  try {
    const ticketPriceCents = 1000;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Movie Tickets" },
            unit_amount: ticketPriceCents,
          },
          quantity: selectedSeats.length,
        },
      ],
      success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-cancelled",
      metadata: {
        userId,
        showtimeId,
        selectedSeats: selectedSeats.join(","), // stored as comma-separated string
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// ==========================
// CONFIRM PAYMENT
// ==========================
router.post('/confirm-payment', async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session ID' });
    }
  
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const metadata = session.metadata;
  
      const userId = metadata.userId;
      const showtimeId = metadata.showtimeId;
      const selectedSeats = metadata.selectedSeats
        ? metadata.selectedSeats.split(',')
        : [];
  
      const totalPrice = (session.amount_total / 100).toFixed(2); // convert from cents
  
      await insertBooking({
        userId,
        showtimeId,
        selectedSeats,
        totalPrice,
        stripeSessionId: sessionId, // ✅ now pass this
      });
  
      return res.json({ success: true, message: 'Booking confirmed' });
    } catch (error) {
      console.error('❌ Error confirming payment:', error.message);
      return res.status(500).json({ error: 'Server error during payment confirmation' });
    }
  });

export default router;
