type Gender = "male" | "female";

type TUser = {
  email: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  is_bvn_verified: boolean;
  primary_account_linked: boolean;
  wallet_account: string;
  role_id: "1" | "2"; // correspond to user or admin
  username: string;
};

type ErrorResponse = {
  responseCode: string;
  responseMessage: string;
};

type TLoginResponse = {
  message: string;
  responseCode: string; // 00 is success
  token: string;
  user: TUser;
};

type TAddBVNResponse = {
  "BVN Validated": boolean;
  responseCode: string;
  responseMessage: string;
};

type AccountType = {
  accountName: string;
  accountNumber: number;
  bank: string;
};

type TProfile = {
  address: string;
  gender: Gender;
  email: string;
  birthday: string;
  phoneNumber: string;
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  nextOfKinEmail: string;
  nextOfKinRelationship: string;
  nextOfKinPhoneNumber: string;
};

type ProfileResponseData = {
  message: string;
  profile: TProfile;
  responseCode: string;
};

type APIResponse<T> = {
  message: string;
  responseCode: string;
} & T;

type SoloSavings = {
  AccountNo: string;
  Amount: number;
};

type TAccountDetails = {
  totalLoan: number;
  familyVault: FamilyVault | null;
  hasSoloAccount: boolean;
  soloSavings: SoloSavings | null;
  targetSavings: TargetSavings | null;
  firstName: string;
  investmentAmount: number;
  lastName: string;
  userName: string;
};

type TAddAccountResponse = {
  responseCode: string;
  responseMessage: string;
};

type TWalletInfo = {
  currency: string;
  availableBalance: number;
  totalBalance: number;
  lienAmount: number;
  walletId: string;
  accountType: string; // I have seen INDIVIDUAL_ACCOUNT, I don't know if there's another type
};

type TTargetSavingsPlan = {
  id: string;
  name: string;
  description: string;
  amount: number;
  target: number;
};
