import { NextResponse } from 'next/server';

const CURRENCY_PACKAGES = [
  { id: 'pink', name: 'Pink Package', vcoin: 1000, ruby: 10, price: 199 },
  { id: 'brown', name: 'Brown Package', vcoin: 4200, ruby: 42, price: 499 },
  { id: 'silver', name: 'Silver Package', vcoin: 11000, ruby: 110, price: 999 },
  { id: 'gold', name: 'Gold Package', vcoin: 24000, ruby: 240, price: 1999 },
  { id: 'titanium', name: 'Titanium Package', vcoin: 67500, ruby: 675, price: 4999 },
  { id: 'diamond', name: 'Diamond Package', vcoin: 150000, ruby: 1500, price: 9999 },
];

const SUBSCRIPTION_PLANS = [
  { id: 'pro_monthly', name: 'Pro Monthly', price: 999, interval: 'month' },
  { id: 'pro_yearly', name: 'Pro Yearly', price: 7999, interval: 'year' },
  { id: 'unlimited_monthly', name: 'Unlimited Monthly', price: 1999, interval: 'month' },
  { id: 'unlimited_yearly', name: 'Unlimited Yearly', price: 14999, interval: 'year' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, packageId, planId, userId, clientId, returnUrl } = body;

    // In production, this would create a Stripe Checkout session
    // For now, return a placeholder response
    if (type === 'currency') {
      const pkg = CURRENCY_PACKAGES.find(p => p.id === packageId);
      if (!pkg) {
        return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
      }
      return NextResponse.json({
        message: 'Stripe integration pending - configure STRIPE_SECRET_KEY',
        package: pkg,
        userId,
        clientId,
        // In production: url: session.url
      });
    }

    if (type === 'subscription') {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      return NextResponse.json({
        message: 'Stripe integration pending - configure STRIPE_SECRET_KEY',
        plan,
        returnUrl,
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
