import { Suspense } from 'react';
import BrowsePage from '@/pages/BrowsePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowsePage />
    </Suspense>
  );
}
