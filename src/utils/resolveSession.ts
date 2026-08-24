import type { UserInfo } from "@/types";
import { isExpiredSession } from "./isExpiredSession";

export const resolveSession = (
  user: UserInfo | null,
  me: { data: UserInfo | undefined; error: unknown },
  online: boolean,
): UserInfo | null => {
  if (isExpiredSession(me.error, online)) {
    return null;
  }

  return user ?? me.data ?? null;
};
