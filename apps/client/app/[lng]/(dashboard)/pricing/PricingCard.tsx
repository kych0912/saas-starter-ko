import { Check } from "lucide-react";
import { SubmitButton } from "./submit-button";
import { createCheckoutAction } from "@/lib/payments/actions";
import { useTranslation } from "@/app/i18n/useTranslation";
import {
  DemoPeriodUnit,
  IntervalUnit,
  ProductPricedto,
  ProductProductDTO,
} from "@/lib/payments/types/Product";

export default async function PricingCard({
  product,
  price,
  lng,
}: {
  product: ProductProductDTO;
  price: ProductPricedto;
  lng: string;
}) {
  const { t } = await useTranslation(lng, "pricing");
  const { enabledDemo, demoPeriod, demoPeriodUnit } = product;
  const { planName, currencyPrice, recurring, planDescription } = price;

  const features = planDescription
    ?.split("\n")
    .map((feature) => feature.trim());

  function getUnit(unit: IntervalUnit | DemoPeriodUnit) {
    switch (unit) {
      case IntervalUnit.DAY:
        return t("unit_day");
      case IntervalUnit.WEEK:
        return t("unit_week");
      case IntervalUnit.MONTH:
        return t("unit_month");
      case IntervalUnit.YEAR:
        return t("unit_year");
    }
  }

  function getCurrency(currency: string) {
    switch (currency) {
      case "USD":
        return "$";
      case "KRW":
        return "₩";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
    }
  }

  function decimalFormatPrice(price: number) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return (
    <div className="pt-6">
      <h2 className="text-2xl font-medium text-foreground mb-2">
        {t(planName || "")}
      </h2>
      {enabledDemo && (
        <p className="text-sm text-muted-foreground mb-4">
          {t("trial", { trialDays: demoPeriod, unit: getUnit(demoPeriodUnit) })}
        </p>
      )}
      <p className="text-4xl font-medium text-foreground mb-6">
        {getCurrency(Object.keys(currencyPrice)[0])}
        {decimalFormatPrice(currencyPrice[Object.keys(currencyPrice)[0]])}{" "}
        <span className="text-xl font-normal text-muted-foreground">
          {t("price", {
            interval: recurring?.intervalCount || 1,
            unit: getUnit(recurring?.interval || IntervalUnit.MONTH),
          })}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features?.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{t(feature)}</span>
          </li>
        ))}
      </ul>
      <form action={createCheckoutAction}>
        <input type="hidden" name="productCode" value={product.code} />
        <input type="hidden" name="priceCode" value={price.code} />
        <SubmitButton lng={lng} />
      </form>
    </div>
  );
}
