import { apiFetch } from '@/libs/api';
import { getServerSession } from 'next-auth';
import { ActionResult, ok, fail } from './shared';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type GetAllTransactionsAPIResponse = {
  message: string;
  responseCode: string;
  transactions: TAllTransactions;
};

export async function getAllTransactions(accountNo?: string[]): Promise<ActionResult<TAllTransactions>> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("user not authenticated")
  }

  const email = session.user.email;

  try {
    const res: GetAllTransactionsAPIResponse  = await apiFetch(`/v1/users/user/fetch-transactions?email=${email}`, {
      isProtected: true,
      method: "GET",
      body: {
	accountNo: accountNo
      }
    })

    return ok(res.transactions)
  } catch (e) {
    return fail(e)
  }
};

