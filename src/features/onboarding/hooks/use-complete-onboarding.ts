import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeOnboardingSchema,
  CompleteOnboardingSchemaType,
} from "../onboarding.dto";
import { OnboardingService } from "../onboarding.service";
import { useAuthStore } from "@/features/auth/auth.state";

export function useCompleteOnboarding() {
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  const form = useForm<CompleteOnboardingSchemaType>({
    resolver: zodResolver(completeOnboardingSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CompleteOnboardingSchemaType) =>
      OnboardingService.completeOnboarding(data),
    onSuccess: () => {
      setOnboardingComplete();
    },
  });

  return {
    form,
    isSubmitting: mutation.isPending,
    completeOnboarding: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
