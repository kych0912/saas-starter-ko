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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {
        productPrices.map((price) => (
          <PricingCard
            key={price.code}
            product={stepPayProducts}
            price={price}
            lng={lng}
          />
        ))
      }
      </div>
    </main>
  );
}