// netlify/functions/create-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const SITE_URL = process.env.SITE_URL || 'http://localhost:8888';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Test $1 purchase' },
          unit_amount: 100, // $1
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${SITE_URL}/success.html`,
      cancel_url: `${SITE_URL}/cancel.html`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
