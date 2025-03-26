import PricingCard from './PricingCard';
import { getStepPayProductCode, getStepPayProducts } from '@/lib/payments/steppay/steppay';
import { IntervalUnit } from '@/lib/payments/types/Product';
// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage({params}: {params: Promise<{lng: string}>}) {
  const {lng} = await params;
  const productCode = await getStepPayProductCode();

  const stepPayProducts = await getStepPayProducts(productCode);
  const productPrices = stepPayProducts.prices;

  const basePlan = productPrices.find((product) => product.planName === 'Base');
  const plusPlan = productPrices.find((product) => product.planName === 'Plus');

  const basePrice = basePlan?.currencyPrice;
  const plusPrice = plusPlan?.currencyPrice;

  const demoData = {
    enabledDemo: stepPayProducts.enabledDemo,
    demoPeriod: stepPayProducts.demoPeriod,
    demoPeriodUnit: stepPayProducts.demoPeriodUnit,
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard
          demoData={demoData}
          name={basePlan?.planName || 'Base'}
          price={basePrice || {}}
          unit={basePlan?.recurring?.interval || IntervalUnit.MONTH}
          interval={basePlan?.recurring?.intervalCount || 1}
          features={[
            'unlimited_usage',
            'unlimited_members',
            'email_support',
          ]}
          priceCode={basePlan?.code}
          productCode={productCode}
          lng={lng}
        />
        <PricingCard
          demoData={demoData}
          name={plusPlan?.planName || 'Plus'}
          price={plusPrice || {}}
          unit={plusPlan?.recurring?.interval || IntervalUnit.MONTH}
          interval={plusPlan?.recurring?.intervalCount || 1}
          features={[
            'base_plus',
            'new_feature_plus',
            'CS_plus',
          ]}
          priceCode={plusPlan?.code}
          productCode={productCode}
          lng={lng}
        />
      </div>
    </main>
  );
}