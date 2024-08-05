import React from 'react';
import { auth } from '@/auth';

import BoardPageClient from './BoardPageClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function Page() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }

  //TODO: get initial data

  return (
    <>
      <BoardPageClient />
    </>
  );
}
