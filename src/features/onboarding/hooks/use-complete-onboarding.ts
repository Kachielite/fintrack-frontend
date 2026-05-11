import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeOnboardingSchema,
  CompleteOnboardingSchemaType,
} from "../onboarding.dto";
import { OnboardingService } from "../onboarding.service";
import { useAuthStore } from "@/features/auth/auth.state";

export function useCompleteOnboarding(onSuccess?: () => void) {
  const persistOnboardingComplete = useAuthStore((s) => s.persistOnboardingComplete);

  const form = useForm<CompleteOnboardingSchemaType>({
    resolver: zodResolver(completeOnboardingSchema),
    defaultValues: {
      goal_type: "save",
      income_range: "0-200k",
      pay_frequency: "monthly",
      ref_currency: "NGN",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CompleteOnboardingSchemaType) =>
      OnboardingService.completeOnboarding(data),
    onSuccess: () => {
      // Write to disk immediately — crash-safe — without switching the navigator yet
      persistOnboardingComplete();
      onSuccess?.();
    },
  });

  return {
    form,
    isSubmitting: mutation.isPending,
    completeOnboarding: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
