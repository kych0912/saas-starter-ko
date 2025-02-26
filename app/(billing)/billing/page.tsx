import { Suspense } from 'react';
import { Billing } from '../billing';
export default function BillingPage() {
  return (
    <Suspense>
      <Billing />
    </Suspense>
  );
}
