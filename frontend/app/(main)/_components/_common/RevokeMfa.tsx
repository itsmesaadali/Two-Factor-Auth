"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeMFAMutationFn } from "../../../../lib/api";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useCallback } from "react";

const RevokeMfa = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: revokeMFAMutationFn,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Revoke MFA successfully", {
        description: response.message || "Please try again later",
      });
    },
    onError: (error: any) => {
      toast.error("Revoke MFA failed", {
        description: error.message || "Please try again later",
      });
    },
  });

  const handleClick = useCallback(() => {
    mutate();
  },[])
  return (
    <Button
    onClick={handleClick}
      disabled={isPending}
      className="h-[35px] !text-[#c40006d3] bg-red-100 shadow-none mr-1"
    >
      {isPending && <Loader className="animate-spin mr-2" />}
      Revoke Access
    </Button>
  );
};

export default RevokeMfa;
