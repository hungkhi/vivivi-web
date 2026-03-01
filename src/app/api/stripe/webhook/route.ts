import { NextResponse } from 'next/server';

// Stripe webhook handler
// In production, verify signature with STRIPE_WEBHOOK_SECRET
// Then handle events: checkout.session.completed, customer.subscription.updated, etc.

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // TODO: Verify with Stripe
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    // Handle event types:
    // checkout.session.completed → credit VCoin/Ruby to user_currency
    // customer.subscription.created → update subscriptions table
    // customer.subscription.updated → update tier
    // customer.subscription.deleted → downgrade to free

    const event = JSON.parse(body);

    switch (event.type) {
      case 'checkout.session.completed': {
        // const session = event.data.object;
        // Credit currency or activate subscription
        break;
      }
      case 'customer.subscription.updated': {
        // Update subscription tier in DB
        break;
      }
      case 'customer.subscription.deleted': {
        // Downgrade to free tier
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
