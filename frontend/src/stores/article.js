import { defineStore } from "pinia";
import api from "@/api/axios";

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: null,
  }),
  actions: {
    async getAllArticle() {
      try {
        const response = await api.get('/articles');
        this.articles = response.data
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
    async getArticlesByStatus(status) {
      try {
        const response = await api.get('/articles/status/' + status);
        this.articles = response.data
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async getArticle(id) {
      try {
        const response = await api.get('/articles/' + id);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async addArticle(data) {
      try {
        const response = await api.post('/articles', data);
        return response.data
      } catch (error) {
        console.error(error);
      }
    },

    async updateArticle(id, data) {
      try {
        const response = await api.put('/articles/' + id, data);
        return response.data
      } catch (error) {
        console.error(error);
      }
    }
  },
});
