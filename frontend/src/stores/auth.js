import { defineStore } from "pinia";
import api from "@/api/axios";
import router from '../router'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/auth/login', { username, password });
        this.token = response.data.token;
        this.user = response.data.user;
        console.log("🚀 ~ login ~ this.user:", this.user)
        localStorage.setItem('token', this.token);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      router.push('/login');
    },
  },
  persist: {
    storage: sessionStorage,
    pick: ['user'],
  },
});
