<template>
  <v-form v-model="valid" @submit.prevent="onSubmit" ref="formRef">
    <v-container>
      <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            label="Username"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-btn class="mt-2" type="submit" block :loading="loading">Submit</v-btn>
        </v-col>
    </v-container>
  </v-form>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();
const formRef = ref(null)
const valid = ref(false);
const loading = ref(false);
const password = ref('password123');
const username = ref('writer1');
const passwordRules = [
    value => {
      if (value) return true

      return 'Password is required.'
    }
  ]
const usernameRules = [
    value => {
      if (value) return true

      return 'Username is required.'
    }
  ]

const onSubmit = async () => {
  const {valid} = await formRef.value.validate();
  if(!valid) return;

  const response = await authStore.login(username.value, password.value);
  if(response.token)  {
    router.push('/dashboard');
  }
}
</script>
