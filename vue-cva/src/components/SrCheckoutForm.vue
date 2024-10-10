<!-- eslint-disable vue/no-unused-vars -->
<template>
  <main>
    <h1>Payment</h1>

    <p>
      Enable more payment method types
      <a
        href="https://dashboard.stripe.com/settings/payment_methods"
        target="_blank"
        >in your dashboard</a
      >.
    </p>

    <form id="payment-form" @submit.prevent="handleSubmit">
      <!-- <div id="link-authentication-element" > 
        
      </div> -->
      <div id="payment-element">
        <StripeElements
          v-if="stripeLoaded"
          v-slot="{elements, instance}"
          ref="elms"
          :stripe-key="key"
          :instance-options="instanceOptions"
          :elements-options="elementsOptions"
        >
          <StripeElement
            ref="card"
            type="payment"
            :elements="elements"
            :options="cardOptions"
          />
        </StripeElements>
      </div>
      <button id="submit" :disabled="isLoading">Pay now</button>
      <sr-messages :messages="messages" />
    </form>
  </main>
</template>

<script setup>
import {ref, onMounted, computed, onBeforeMount} from 'vue';
import {loadStripe} from '@stripe/stripe-js';
import {StripeElements, StripeElement} from 'vue-stripe-js';
import {useStripeStore} from '../stores/stripeStore';

import SrMessages from './SrMessages.vue';

const isLoading = ref(false);
const messages = ref([]);
const stripeLoaded = ref(false);
const store = useStripeStore();
const key = ref('');

//let stripe;
//let elements;
const elementsOptions = computed(() => ({
  clientSecret: store.clientSecret,
}));
const elements = ref();
const card = ref();
const elms = ref();

const cardOptions = ref({
  // https://stripe.com/docs/stripe.js#element-options
  value: {
    postalCode: '12345',
  },
});

const instanceOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
});

onBeforeMount(async () => {
  await store.getKey();
  const stripePromise = loadStripe(store.key);
  stripePromise.then(async() => {
    await store.createPaymentIntent();
    stripeLoaded.value = true;
    key.value = store.key;
  }).finally(() => {
    elements.value = elms.value.elements;
  })
});

onMounted(async () => {

  if (store.backendError) {
    messages.value.push(store.backendError.message);
  }
  messages.value.push(`Client secret returned.`);
  //store.clientSecret = clientSecret;

  //console.log(clientSecret);

  //elementsOptions.value = clientSecret
  //console.log(clientSecret)

  //elements = stripe.elements({clientSecret});
  // const paymentElement = elements.create('payment');
  // paymentElement.mount("#payment-element");
  // const linkAuthenticationElement = elements.create("linkAuthentication");
  // linkAuthenticationElement.mount("#link-authentication-element");
  isLoading.value = false;
});

const handleSubmit = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const {error} = await elms.value.instance.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: `${window.location.origin}/return`,
    },
  });

  if (error.type === 'card_error' || error.type === 'validation_error') {
    messages.value.push(error.message);
  } else {
    messages.value.push('An unexpected error occured.');
  }

  isLoading.value = false;
};
</script>
