'use server';

import { redirect } from 'next/navigation';
import { createPayMentsByBillingKey, createPortOneCheckout, createCheckoutSchedule, createCheckoutSubscription } from './portone-server';
import { withTeam } from '@/lib/auth/middleware';
import { getBillingKeyInfo } from './portone-server';

export const createPortOneCheckoutAction = withTeam(async (formData, team) => {
    const priceId = formData.get('priceId') as string;
    await createPortOneCheckout({ team: team, priceId });
});

export const createPayMentsByBillingKeyAction = withTeam(async (formData, team) => {
    const priceId = formData.get('priceId') as string;
    const billingKey = formData.get('billingKey') as string;
    await createCheckoutSubscription({ team: team, priceId, billingKey });
    redirect(`/dashboard`);
});