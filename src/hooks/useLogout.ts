import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/api";
import { persistQueryCache } from "@/lib/persistQueryCache";
import { useAuthStore } from "@/store/auth";

export const useLogout = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => request<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      void persistQueryCache(queryClient);
    },
  });
};
