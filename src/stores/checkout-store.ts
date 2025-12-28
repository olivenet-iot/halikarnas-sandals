"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  cityName: string;
  district: string;
  districtName: string;
  neighborhood?: string;
  address: string;
  postalCode?: string;
}

export type PaymentMethod = "card" | "cash_on_delivery";

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutState {
  currentStep: CheckoutStep;
  shippingInfo: ShippingInfo | null;
  paymentMethod: PaymentMethod;
  acceptedTerms: boolean;
  acceptedKvkk: boolean;

  // Actions
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setAcceptedKvkk: (accepted: boolean) => void;
  reset: () => void;

  // Computed
  canProceedToPayment: () => boolean;
  canProceedToReview: () => boolean;
  canPlaceOrder: () => boolean;
}

const initialState = {
  currentStep: 1 as CheckoutStep,
  shippingInfo: null,
  paymentMethod: "cash_on_delivery" as PaymentMethod,
  acceptedTerms: false,
  acceptedKvkk: false,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 3) {
          set({ currentStep: (currentStep + 1) as CheckoutStep });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as CheckoutStep });
        }
      },

      setShippingInfo: (info) => {
        set({ shippingInfo: info });
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setAcceptedTerms: (accepted) => {
        set({ acceptedTerms: accepted });
      },

      setAcceptedKvkk: (accepted) => {
        set({ acceptedKvkk: accepted });
      },

      reset: () => {
        set(initialState);
      },

      canProceedToPayment: () => {
        const { shippingInfo } = get();
        return shippingInfo !== null;
      },

      canProceedToReview: () => {
        const { shippingInfo, paymentMethod } = get();
        return shippingInfo !== null && paymentMethod !== null;
      },

      canPlaceOrder: () => {
        const { shippingInfo, paymentMethod, acceptedTerms, acceptedKvkk } =
          get();
        return (
          shippingInfo !== null &&
          paymentMethod !== null &&
          acceptedTerms &&
          acceptedKvkk
        );
      },
    }),
    {
      name: "halikarnas-checkout",
      partialize: (state) => ({
        shippingInfo: state.shippingInfo,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);
