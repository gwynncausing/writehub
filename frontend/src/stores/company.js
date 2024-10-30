import { defineStore } from "pinia";
import api from "@/api/axios";

export const useCompanyStore = defineStore('company', {
  state: () => ({
    companies: null,
  }),
  actions: {
    async getAllCompany() {
      try {
        const response = await api.get('/companies');
        this.companies = response.data
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async getCompany(id) {
      try {
        const response = await api.get('/companies/' + id);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async addCompany(data) {
      try {
        const response = await api.post('/companies', data);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async updateCompany(id, data) {
      try {
        const response = await api.put('/companies/' + id, data);
        return response.data
      } catch (error) {
        console.error(error);
      }
    }
  },
});
