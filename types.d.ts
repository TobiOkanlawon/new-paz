type TUser = {
  email: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  is_bvn_verified: boolean;
  role_id: "1" | "2"; // correspond to user or admin
  username: string;
};

type ErrorResponse = {
  responseCode: string;
  responseMessage: string;
}

type TLoginResponse = {
  message: string;
  responseCode: string; // 00 is success
  token: string;
  user: TUser;
}

type TAddBVNResponse = {
  "BVN Validated": boolean;
  responseCode: string;
  responseMessage: string;
};

type AccountType = {
  accountName: string;
  accountNumber: number;
  bank: string;
}
