import { defineStore } from "pinia"

export const useStripeStore = defineStore('stripe', {
    state: () => ({ clientSecret: '', backendError: '', key: ''}),
    getters: {
    },
    actions: {
      async createPaymentIntent() {
        const {clientSecret, error: backendError} = await fetch(
          '/api/create-payment-intent'
        ).then((res) => res.json());
        this.clientSecret = clientSecret;
        this.backendError = backendError;
        },
        async getKey() {
          const {publishableKey} = await fetch('/api/config').then((res) => res.json());
          this.key = publishableKey;
        }
    },
  })