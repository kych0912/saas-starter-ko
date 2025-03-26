'use server';

import { withTeam } from '@/lib/auth/middleware';
import { createCheckout, redirectToCheckout } from './steppay/steppay';

export const createCheckoutAction = withTeam(async (formData, team) => {
    const productCode = formData.get('productCode') as string;
    const priceCode = formData.get('priceCode') as string;
    const order = await createCheckout({ team: team, productCode, priceCode });
    await redirectToCheckout(order.orderCode);
});

