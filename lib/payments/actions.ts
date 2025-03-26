'use server';

import { withTeam } from '@/lib/auth/middleware';
import { createCheckout, createCustomPortalSession, redirectToCheckout } from './steppay/steppay';
import { redirect } from 'next/navigation';

export const createCheckoutAction = withTeam(async (formData, team) => {
    const productCode = formData.get('productCode') as string;
    const priceCode = formData.get('priceCode') as string;
    const order = await createCheckout({ team: team, productCode, priceCode });
    await redirectToCheckout(order.orderCode);
});

export const createCustomPortalSessionAction = withTeam(async (_, team) => {
    const session = await createCustomPortalSession(team);
    redirect(`/billing?session=${session}`);
});
