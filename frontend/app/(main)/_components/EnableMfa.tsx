"use client";
import React, { useCallback, useState } from "react";
import { z } from "zod";
import { Check, Copy, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mfasetupQueryFn,
  mfaType,
  verifyMFAMutationFn,
} from "../../../lib/api";
import { Skeleton } from "../../../components/ui/skeleton";
import { toast } from "sonner";
import RevokeMfa from "./_common/RevokeMfa";

const EnableMfa = () => {
  const queryClient = useQueryClient();
  const { user, refetch } = useAuthContext();
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["mfa-setup"],
    queryFn: mfasetupQueryFn,
    enabled: isOpen,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyMFAMutationFn,
  });

  const mfaData = data ?? ({} as mfaType);

  const FormSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const data = {
      code: values.pin,
      secretKey: mfaData.secret,
    };

    mutate(data, {
      onSuccess: (response: any) => {
        queryClient.invalidateQueries({
          queryKey: ["authUser"],
        });
        refetch();
        setIsOpen(false);
        toast.success("Two factor enable successfully", {
          description: response.message || "MFA enable successfully",
        });
      },
      onError: (error: any) => {
        toast.error("Two factor enable failed", {
          description: error.message || "Please try again later",
        });
      },
    });
  }

  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
      <div className="rounded-[10px] p-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
            Multi-Factor Authentication (MFA)
          </h3>
          {user?.userPreferences?.enable2FA && (
            <span className="select-none whitespace-nowrap font-medium bg-green-100 text-green-500 text-xs h-6 px-2 rounded flex flex-row items-center justify-center gap-1">
              Enabled
            </span>
          )}
        </div>
        <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Protect your account by adding an extra layer of security.
        </p>
        {user?.userPreferences?.enable2FA ? (
          <RevokeMfa />
        ) : (
          <Dialog
            modal
            open={isOpen}
            onOpenChange={(open) => !isPending && setIsOpen(open)}
          >
            <DialogTrigger asChild>
              <Button>Enable MFA</Button>
            </DialogTrigger>
            <DialogContent className="z-[9999] sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Setup MFA</DialogTitle>
              </DialogHeader>

              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="border-2 border-black rounded-md p-2 bg-white">
                  {isLoading ? (
                    <Skeleton className="w-[200px] h-[200px]" />
                  ) : (
                    <img
                      src={mfaData.qrImageUrl}
                      width={200}
                      height={200}
                      alt="MFA QR Code"
                      className="rounded-sm"
                    />
                  )}
                </div>

                {!showKey ? (
                  <Button
                    variant="link"
                    onClick={() => setShowKey(true)}
                    className="text-primary"
                  >
                    Can't scan? Enter code manually
                  </Button>
                ) : (
                  <div className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Setup Key</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCopy(mfaData?.secret)}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <code className="text-sm break-all font-mono">
                      {mfaData?.secret}
                    </code>
                  </div>
                )}
              </div>

              {/* Verification Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-4 space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup className="gap-1">
                                {[...Array(6)].map((_, i) => (
                                  <InputOTPSlot
                                    key={i}
                                    index={i}
                                    className="w-12 h-12 text-lg"
                                  />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader className="mr-2 animate-spin" />}
                    Verify
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EnableMfa;
