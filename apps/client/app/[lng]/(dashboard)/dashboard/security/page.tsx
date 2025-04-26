import { Suspense } from 'react';
import { useTranslation } from '@/app/i18n/useTranslation';
import { UpdatePasswordCard } from './UpdatePasswordCard';
import { DeleteAccountCard } from './DeleteAccountCard';
import { isOauthPassword } from '@/lib/auth/user-auth';
import { getUser } from '@/lib/db/queries';

export default async function SecurityPage({params}: {params: Promise<{lng: string}>}) {
  const { lng } = await params;
  const { t } = await useTranslation(lng, 'security');
  const user = await getUser();
  const isOauthPromise = isOauthPassword(user?.passwordHash || '');

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-foreground mb-6">
        {t('title')}
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UpdatePasswordCard 
          isOauthPromise={isOauthPromise}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <DeleteAccountCard 
          isOauthPromise={isOauthPromise}
        />
      </Suspense>
    </section>
  );
}
