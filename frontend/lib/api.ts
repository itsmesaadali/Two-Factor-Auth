import API from "./axios-client";

type LoginType = {
  email: string;
  password: string;
};

type RegisterType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordType = {
  email: string;
};

type ResetPasswordType = {
  password: string;
  verificationCode: string;
};

type VerifyEmailType = {
  code: string;
};

export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};

type verifyMFAType = {
  code: string;
  secretKey: string;
};

type verifyMfaLoginType = {
  code: string;
  email: string;
};

type SessionType = {
  _id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiredAt: string;
  isCurrent: boolean;
};

type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

export const loginMutationFn = async (data: LoginType) =>
  await API.post("/auth/login", data);

export const registerMutationFn = async (data: RegisterType) =>
  await API.post("/auth/register", data);

export const verifyEmailMutationFn = async (data: VerifyEmailType) =>
  await API.post("/auth/verify/email", data);

export const forgotPasswordMutationFn = async (data: ForgotPasswordType) =>
  await API.post("/auth/password/forgot", data);

export const resetPasswordMutationFn = async (data: ResetPasswordType) =>
  await API.post("/auth/password/reset", data);

export const verifyMFALoginMutationFn = async (data: verifyMfaLoginType) =>
  await API.post("/mfa/verify-login", data);

export const mfasetupQueryFn = async () => {
  const response = await API.get<mfaType>("/mfa/setup");
  return response.data;
};

export const verifyMFAMutationFn = async (data: verifyMFAType) =>
  await API.post("/mfa/verify", data);

export const revokeMFAMutationFn = async () =>
  await API.post("/mfa/revoke", {});

export const getUserSessionQueryFn = async () => await API.get("/session/");

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>("sessions/all");
  return response.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/session/${id}`);
