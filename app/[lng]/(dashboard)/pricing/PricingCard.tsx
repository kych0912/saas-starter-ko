import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { createPortOneCheckoutAction } from '@/lib/payments/actions';
import { useTranslation } from '@/app/i18n/useTranslation';

export default async function PricingCard({
    name,
    price,
    interval,
    trialDays,
    features,
    priceId,
    lng,
  }: {
    name: string;
    price: number;
    interval: number;
    trialDays: number;
    features: string[];
    priceId?: string;
    lng: string;
  }) {
    const {t} = await useTranslation(lng, 'pricing');

    return (
      <div className="pt-6">
        <h2 className="text-2xl font-medium text-foreground mb-2">{t(name)}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('trial', {trialDays})}
        </p>
        <p className="text-4xl font-medium text-foreground mb-6">
          ${price / 100}{' '}
          <span className="text-xl font-normal text-muted-foreground">
            {t('price',{interval})}
          </span>
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{t(feature)}</span>
            </li>
          ))}
        </ul>
        <form action={createPortOneCheckoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton lng={lng}/>
        </form>
      </div>
    );
  }