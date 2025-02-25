// import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { getProducts } from '@/lib/db/queries';
import PricingCard from './PricingCard';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const products = await getProducts();

  const basePlan = products.find((product) => product.productName === 'Base');
  const plusPlan = products.find((product) => product.productName === 'Plus');

  const basePrice = products.find((product) => product.productId === basePlan?.productId);
  const plusPrice = products.find((product) => product.productId === plusPlan?.productId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
        <PricingCard
          name={basePlan?.productName || 'Base'}
          price={Number(basePrice?.priceUnitAmount) || 800}
          interval={basePrice?.priceInterval || 'month'}
          trialDays={basePrice?.priceTrialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
          priceId={basePrice?.priceId}
        />
        <PricingCard
          name={plusPlan?.productName || 'Plus'}
          price={Number(plusPrice?.priceUnitAmount) || 1200}
          interval={plusPrice?.priceInterval || 'month'}
          trialDays={plusPrice?.priceTrialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
          priceId={plusPrice?.priceId}
        />
      </div>
    </main>
  );
}