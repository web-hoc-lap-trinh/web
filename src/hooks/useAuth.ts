import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentToken,
  logout as logoutAction, 
} from "../stores/slices/authSlice";
import { authApi, useLoginMutation } from "../services/auth/auth.service";
import type { AppDispatch } from "../stores/store";
import type { LoginPayload, AuthResponse } from "../services/auth/auth.types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginMutation, loginState] = useLoginMutation();
  
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectCurrentToken);

  const login = async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = await loginMutation(payload).unwrap();
    return data;
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(authApi.util.resetApiState());
  };

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      token,
      login,
      logout,
      loginLoading: loginState.isLoading,
      loginError: loginState.error,
    }),
    [user, isAuthenticated, token, loginState.isLoading, loginState.error]
  );
};