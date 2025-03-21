import { AxiosError } from "axios";

export const getErrorResponseOnCatch = (error: unknown): string => {
  let _messageError = "Unknown error occurred";

  if (error instanceof AxiosError) {
    _messageError =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.response?.statusText ??
      error.code;
  }
  return _messageError;
};
