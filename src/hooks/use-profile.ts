"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfile } from "@/lib/api/users";
import { queryKeys } from "@/lib/query/keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      // The update response is partial, so reload the full profile.
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.success("Profile updated");
    },
  });
}