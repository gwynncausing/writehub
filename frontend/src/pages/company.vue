<template>
  <div class="pa-4">
    <h1>company list</h1>
  
    <v-btn color="primary" class="my-6" @click="openDialog(null)">Add </v-btn>
  
    <v-card v-for="item in companies" :key="item.id" class="mb-6 pa-6">
      <v-img 
        :width="200"
        aspect-ratio="16/9"
        cover
        :src="`http://localhost:8080/${item.logo}`" lazy alt="Company Logo"/>
      <div>{{ item.name }}</div>
      <div>{{ item.status }}</div>
      
      <v-btn color="primary" class="mt-4" @click="openDialog(item.id)">Edit</v-btn>
    </v-card>
  </div>

  <v-dialog v-model="dialog" max-width="500">
    <v-card title="Dialog">
      <v-card-text>
        <CompanyForm :isUpdate="!!selectedId" :id="selectedId" @save="onSave" ref="companyFormRef"/>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref } from 'vue';
import { useCompanyStore } from '@/stores/company';

const companyStore = useCompanyStore();
const companies = ref([])
const dialog = ref(false)
const selectedId = ref(null)
const companyFormRef = ref(null)

const getAllCompany = async () => {
  const response = await companyStore.getAllCompany();
  companies.value = response
}

const openDialog = (id = null) => {
  if(id) {
    selectedId.value = id;
  }
  dialog.value = true
}

const onSave = () => {
  console.log(companyFormRef.value);
  companyFormRef.value.clear();
  dialog.value = false
  getAllCompany();
}

onMounted(() => {
  getAllCompany();
})
</script>
