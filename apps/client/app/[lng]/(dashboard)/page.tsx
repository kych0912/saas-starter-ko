import { Button } from "@saas/ui";
import { ArrowRight, CreditCard, Database, Check, Clock } from "lucide-react";
import { Terminal } from "./terminal";
import { useTranslation } from "@/app/i18n/useTranslation";
import {
  features as featureData,
  pricing as pricingData,
} from "@/data/constants";

async function FeatureCard({
  title,
  description,
  timeSaved,
  lng,
}: {
  title: string;
  description: string;
  timeSaved?: string;
  lng: string;
}) {
  const { t } = await useTranslation(lng, "features");
  const { t: common } = await useTranslation(lng, "common");
  return (
    <div className="shadow-primary/5 p-2 shadow-sm">
      <h4 className="flex flex-col space-y-2 text-lg font-medium text-foreground tracking-tight">
        {t(title)}
      </h4>
      <div className="py-2.5">
        <div className="text-base text-muted-foreground flex flex-col space-y-2">
          {t(description)}
          {timeSaved && (
            <div className="mt-2 flex items-center text-sm text-orange-500 font-medium">
              <Clock className="h-4 w-4 mr-1" />
              {t(timeSaved) + " " + common("hours")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PricingCardProps {
  titleKey: string;
  descriptionKey: string;
  priceKey: string;
  priceUnitKey: string;
  featuresKey: string[];
  buttonKey: string;
  hyperlinkKey: string;
  isRecommended?: boolean;
  lng: string;
}

async function PricingCard({
  titleKey,
  descriptionKey,
  priceKey,
  priceUnitKey,
  featuresKey,
  buttonKey,
  hyperlinkKey,
  isRecommended,
  lng,
}: PricingCardProps) {
  const { t } = await useTranslation(lng, "pricing_main");
  return (
    <div className="relative flex flex-col rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
      {isRecommended && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          {t("supporter_badge")}
        </div>
      )}
      <div className="p-6 pt-8">
        <h3 className="font-heading text-xl font-semibold leading-none tracking-tight">
          {t(titleKey)}
        </h3>
        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          {t(descriptionKey)}
        </div>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="font-heading text-4xl font-bold">{t(priceKey)}</span>
          <span className="text-muted-foreground">{t(priceUnitKey)}</span>
        </div>

        <ul className="mt-8 flex flex-col gap-3 text-sm">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{t(featuresKey[0])}</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{t(featuresKey[1])}</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{t(featuresKey[2])}</span>
          </li>
        </ul>
      </div>

      <div className="mt-auto p-6 pt-0">
        <a
          href={isRecommended ? undefined : hyperlinkKey}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            isRecommended
              ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {t(buttonKey)}
        </a>
      </div>
    </div>
  );
}
export default async function HomePage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;

  const { t: Hero } = await useTranslation(lng, "hero");
  const { t: benefit } = await useTranslation(lng, "benefit");
  const { t: CTA } = await useTranslation(lng, "CTA");
  const { t: features } = await useTranslation(lng, "features");
  const { t: pricing } = await useTranslation(lng, "pricing_main");
  const { t: saved } = await useTranslation(lng, "saved");

  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl">
                {Hero("title")}
                <span className="block text-orange-500">
                  {Hero("subtitle")}
                </span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                {Hero("description")}
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://github.com/kych0912/saas-starter-ko"
                  target="_blank"
                >
                  <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                    {Hero("button")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    fill="currentColor"
                    d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                  />
                </svg>
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-foreground">
                  {benefit("first_title")}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {benefit("first_description")}
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-foreground">
                  {benefit("second_title")}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {benefit("second_description")}
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-foreground">
                  {benefit("third_title")}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {benefit("third_description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="flex max-w-3xl flex-col items-center space-y-6 text-center">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex flex-col">
                <h2 className="font-heading scroll-m-20 pb-2 text-2xl font-semibold transition-colors first:mt-0 lg:text-3xl tracking-tighter">
                  {features("title")}
                </h2>
                <h3 className="scroll-m-20 lg:text-2xl text-muted-foreground text-xl font-normal tracking-tight">
                  <span className="flex flex-col space-y-1">
                    <span>{features("description_first")}</span>
                    <span>{features("description_second")}</span>
                    <span>{features("description_third")}</span>
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {featureData.map((feature) => (
              <FeatureCard
                key={feature.titleKey}
                title={feature.titleKey}
                description={feature.descriptionKey}
                timeSaved={feature.timeSavedKey}
                lng={lng}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 총 절약 시간 섹션 */}
      <section className="py-16 bg-background w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {saved("title")}
            </h2>
            <div className="flex justify-center items-center mb-6">
              <span className="text-4xl md:text-6xl sm:text-5xl font-bold text-orange-500">
                100+
              </span>
              <div className="text-3xl md:text-6xl sm:text-5xl font-bold text-foreground ml-4">
                {saved("hours")}
              </div>
            </div>
            <div className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {saved("subtitle_1")}
            </div>
            <div className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {saved("subtitle_2")}
            </div>
            <div className="mt-8">
              <div className="inline-flex items-center justify-center px-6 py-3 border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-black shadow-sm">
                <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-orange-500">
                      20+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {saved("features")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500">
                      100+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {saved("time")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-500">₩0</div>
                    <div className="text-sm text-muted-foreground">
                      {saved("open_source")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="flex max-w-3xl flex-col items-center space-y-6 text-center">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex flex-col">
                <h2 className="font-heading scroll-m-20 pb-2 text-2xl font-semibold transition-colors first:mt-0 lg:text-3xl tracking-tighter">
                  {pricing("title")}
                </h2>
                <h3 className="scroll-m-20 lg:text-2xl text-muted-foreground text-xl font-normal tracking-tight">
                  <span className="flex flex-col space-y-1">
                    <span>{pricing("description")}</span>
                  </span>
                </h3>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8 w-full">
            {pricingData.map((plan, index) => (
              <PricingCard key={index} {...plan} lng={lng} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                {CTA("title")}
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
                {CTA("description")}
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <a
                href="https://github.com/kych0912/saas-starter-ko"
                target="_blank"
              >
                <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
                  {CTA("button")}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
