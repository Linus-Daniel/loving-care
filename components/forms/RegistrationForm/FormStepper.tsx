import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type FormStepperProps = {
  steps: string[];
  currentStep: number;
};

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {steps.map((step, index) => {
        const completed = index < currentStep;
        const active = index === currentStep;

        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                completed && "bg-success text-white",
                active && "bg-green text-yellow",
                !completed && !active && "bg-muted text-muted-foreground",
              )}
            >
              {completed ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span className={cn("text-xs font-medium", active ? "text-green" : "text-muted-foreground")}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
