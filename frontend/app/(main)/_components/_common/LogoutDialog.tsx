import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { logoutMutationFn } from "../../../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { isOpen, setIsOpen } = props;
  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error: any) => {
      toast.error("Logout failed", {
        description: error.message || "Please try again later",
      });
    },
  });

  const handleLogout = useCallback(()=> {
    mutate();
  },[])
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure want to Log out?</DialogTitle>
            <DialogDescription>
              This will end you current session and you will need to login again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
            className="!text-white"
            onClick={handleLogout}
            disabled={isPending} type="button">
              {isPending && <Loader className="animate-spin mr-2" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
