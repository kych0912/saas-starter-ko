import { Suspense } from 'react';
import { Login } from '../login';

export default async function SignUpPage({
  params,
}: {
  params: Promise<{lng: string}>
}) {
  const { lng } = await params;
  return (
    <Suspense>
      <Login lng={lng} mode="signup" />
    </Suspense>
  );
}
