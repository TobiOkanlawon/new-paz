import useToken from "@/store/tokenStore";

export const getToken = (): string | null => {
  return useToken.getState().token;
};

export const storeToken = (token: string) => {
  return useToken.getState().setToken(token);
};

export const removeToken = () => {
  return useToken.getState().removeToken();
};
