<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="`http://localhost:8080/${props.data.image}`"
      cover
    >
      <v-card-title>{{props.data.title}}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      <div>{{ new Date(props.data.date).toLocaleDateString("en-US") }}</div>
      <small><a :href="props.data.link">{{props.data.link}}</a></small>
    </v-card-subtitle>

    <v-card-text>
      <div v-if="props.data.writer_firstname || props.data.writer_lastname">
        Writer: {{ props.data.writer_firstname }} {{ props.data.writer_lastname }}
      </div>
      <div v-if="props.data.editor_firstname || props.data.editor_lastname">
        Editor: {{ props.data.editor_firstname }} {{ props.data.editor_lastname }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn v-if="props.data.status !== 'Published'" color="orange" text="Edit"></v-btn>

      <v-btn v-if="role === 'editor'" color="orange" text="Publish"></v-btn>
      
      <div class="bg-light-blue px-3 py-1 ml-auto" v-if="showStatus">{{ props.data.status }}</div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const props = defineProps({
  showStatus: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object
  }
});
const role = ref(null);
const user = ref(null);
const authStore = useAuthStore();
onMounted(async () => {
  user.value = authStore.user
  role.value = user.value.type
});
</script>

<style lang="scss" scoped>

</style>