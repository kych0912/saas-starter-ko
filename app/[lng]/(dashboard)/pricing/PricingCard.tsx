import { Check } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { createPortOneCheckoutAction } from '@/lib/payments/actions';
import { useTranslation } from '@/app/i18n/useTranslation';
import { DemoPeriodUnit, IntervalUnit } from '@/lib/payments/types/Product';

export default async function PricingCard({
    name,
    price,
    interval,
    features,
    priceId,
    lng,
    demoData,
    unit
  }: {
    name: string;
    price: Record<string,number>;
    interval: number;
    features: string[];
    priceId?: string;
    lng: string;
    demoData: {
      enabledDemo: boolean;
      demoPeriod: number;
      demoPeriodUnit: DemoPeriodUnit;
    };
    unit: IntervalUnit;
  }) {
    const {t} = await useTranslation(lng, 'pricing');

    function getUnit(unit: IntervalUnit | DemoPeriodUnit){
      switch(unit){
        case IntervalUnit.DAY:
          return t('unit_day')
        case IntervalUnit.WEEK:
          return t('unit_week')
        case IntervalUnit.MONTH:
          return t('unit_month')
        case IntervalUnit.YEAR:
          return t('unit_year')
      }
    }

    function getCurrency(currency: string){
      switch(currency){
        case 'USD':
          return '$'
        case 'KRW':
          return '₩'
        case 'EUR':
          return '€'
        case 'GBP':
          return '£'
      }
    }

    function demicalFormatPrice(price:number){
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    
    return (
      <div className="pt-6">
        <h2 className="text-2xl font-medium text-foreground mb-2">{t(name)}</h2>
        {demoData.enabledDemo && (
          <p className="text-sm text-muted-foreground mb-4">
            {t('trial', {trialDays: demoData.demoPeriod,unit:getUnit(demoData.demoPeriodUnit)})}
          </p>
        )}
        <p className="text-4xl font-medium text-foreground mb-6">
          {getCurrency(Object.keys(price)[0])}{demicalFormatPrice(price[Object.keys(price)[0]])}{' '}
          <span className="text-xl font-normal text-muted-foreground">
            {t('price',{interval:interval,unit:getUnit(unit)})}
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