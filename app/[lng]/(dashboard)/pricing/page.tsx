import { getProducts } from '@/lib/db/queries';
import PricingCard from './PricingCard';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage({params}: {params: Promise<{lng: string}>}) {
  const {lng} = await params;
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
          interval={basePrice?.priceInterval || 30}
          trialDays={basePrice?.priceTrialPeriodDays || 7}
          features={[
            'unlimited_usage',
            'unlimited_members',
            'email_support',
          ]}
          priceId={basePrice?.priceId}
          lng={lng}
        />
        <PricingCard
          name={plusPlan?.productName || 'Plus'}
          price={Number(plusPrice?.priceUnitAmount) || 1200}
          interval={plusPrice?.priceInterval || 30}
          trialDays={plusPrice?.priceTrialPeriodDays || 7}
          features={[
            'base_plus',
            'new_feature_plus',
            'CS_plus',
          ]}
          priceId={plusPrice?.priceId}
          lng={lng}
        />
      </div>
    </main>
  );
}