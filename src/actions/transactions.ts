import { apiFetch } from '@/libs/api';
import { getServerSession } from 'next-auth';
import { ActionResult, ok, fail } from '@/actions/shared';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type TransactionsDataResponse = {
  id: number;
  from_account: string;
  to_account: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: "COMPLETED" | "FAILED";
  created_at: string;
};

type GetAllTransactionsAPIResponse = {
  message: string;
  responseCode: string;
  transactions: TransactionsDataResponse[];
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
    })

    if (res == null){
      return ok([])
    }

    if (!res || !res.transactions) {
      return fail(new Error("Invalid response from API"));
    }

    const transformedData: TAllTransactions = res.transactions.map((i: TransactionsDataResponse) => {
      return {
	id: i.id,
	fromAccount: i.from_account,
	toAccount: i.to_account,
	amount: i.amount,
	currency: i.currency,
	description: i.description,
	reference: i.reference,
	status: i.status,
	createdAt: i.created_at
      }
    })

    return ok(transformedData)
  } catch (e) {
    return fail(e)
  }
};

