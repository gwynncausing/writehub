<template>
  <div>
    <v-tabs
      v-model="tab"
      align-tabs="center"
      color="deep-purple-accent-4"
    >
      <v-tab value="overview">Overview</v-tab>
      <v-tab value="For Edit">{{role === 'writer' ? 'For Edit' : 'For Publish'}}</v-tab>
      <v-tab value="Published">Published</v-tab>
    </v-tabs>

    <v-btn href="/article">Add Article</v-btn>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="n in tabs"
        :key="n"
        :value="n"
      >
        <v-container fluid>
          <v-row>
            <v-col
              v-for="article in articles"
              :key="article"
              cols="12"
              md="4"
            >
              <ArticleCard show-status :data="article" />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useArticleStore } from '@/stores/article';

const tab = ref(null);
const tabs = ['overview', 'For Edit', 'Published'];

const articles = ref(null)
const articleStore = useArticleStore();

const role = ref(null);
const user = ref(null);
const authStore = useAuthStore();
onMounted(async () => {
  user.value = authStore.user
  role.value = user.value.type
  articles.value = await articleStore.getAllArticle();
  console.log("🚀 ~ onMounted ~ articles.value:", articles.value)
});

watch(tab, async () => {
  articles.value = []
  if(tab.value === 'overview') {
    articles.value = await articleStore.getAllArticle();
  }
  else {
    articles.value = await articleStore.getArticlesByStatus(tab.value);
  }
});

</script>

<style lang="scss" scoped>

</style>