import React from 'react';
import { auth } from '@/auth';
import mongoose from 'mongoose';

import BoardPageClient from './BoardPageClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { getColumnsOnBoard } from '@/lib/utils/column-utils'

export default async function Page() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: 'Not Authorized, no session' },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  let columnsOnBoard = [];
  let errorMessage = null;

  //TODO: get initial data
  try {
    columnsOnBoard = await getColumnsOnBoard(userId);
  } catch (error) {
    errorMessage = error.message;
    console.error('Error fetching columns for board: ', error);
  }

  return (
    <>
      <BoardPageClient columnsOnBoard={columnsOnBoard} />
    </>
  );
}
