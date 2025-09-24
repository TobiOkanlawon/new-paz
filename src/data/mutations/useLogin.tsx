import { axiosInstance as axios, storeToken } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { authTokenState, userState } from "../atoms";

type SignInData = {
  email: string;
  password: string;
  remember?: boolean;
};

export const useLogin = () => {
  const setUser = useSetRecoilState(userState);
  const setAuthState = useSetRecoilState(authTokenState);

  return useMutation<TLoginResponse, any, SignInData>({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      return await axios
        .post("/v1/users/user/login", {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (data, variables, context) => {
      if (variables.remember) {
        storeToken("persist", data.token);
      }

      setUser(data.user);

      toast("Login successful");
    },
    onError: () => {
      toast("An error occurred during login");
    },
  });
};
