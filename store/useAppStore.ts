import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegistrationDraft = Record<string, string | boolean | number | null>;

type AppState = {
  registrationStep: number;
  registrationDraft: RegistrationDraft;
  setRegistrationStep: (step: number) => void;
  updateRegistrationDraft: (values: RegistrationDraft) => void;
  resetRegistrationDraft: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      registrationStep: 0,
      registrationDraft: {},
      setRegistrationStep: (step) => set({ registrationStep: step }),
      updateRegistrationDraft: (values) =>
        set((state) => ({
          registrationDraft: { ...state.registrationDraft, ...values },
        })),
      resetRegistrationDraft: () => set({ registrationStep: 0, registrationDraft: {} }),
    }),
    {
      name: "loving-family-daycare",
      partialize: (state) => ({
        registrationStep: state.registrationStep,
        registrationDraft: state.registrationDraft,
      }),
    },
  ),
);
