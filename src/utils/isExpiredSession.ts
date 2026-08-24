import { ApiError } from "@/lib/api";

export const isExpiredSession = (error: unknown, online: boolean) =>
  online && error instanceof ApiError && error.status === 401;
