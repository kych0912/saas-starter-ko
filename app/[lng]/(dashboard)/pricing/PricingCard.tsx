import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { createPortOneCheckoutAction } from '@/lib/payments/actions';

export default function PricingCard({
    name,
    price,
    interval,
    trialDays,
    features,
    priceId,
  }: {
    name: string;
    price: number;
    interval: number;
    trialDays: number;
    features: string[];
    priceId?: string;
  }) {
    
    return (
      <div className="pt-6">
        <h2 className="text-2xl font-medium text-foreground mb-2">{name}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          with {trialDays} day free trial
        </p>
        <p className="text-4xl font-medium text-foreground mb-6">
          ${price / 100}{' '}
          <span className="text-xl font-normal text-muted-foreground">
            per user / {interval} days
          </span>
        </p>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <form action={createPortOneCheckoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      </div>
    );
  }