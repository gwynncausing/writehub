<template>
  <v-form @submit.prevent="onSubmit" ref="formRef">
    <v-img 
        :width="200"
        aspect-ratio="16/9"
        cover
        :src="`http://localhost:8080/${company.oldLogo}`" lazy alt="Company Logo"/>
    <v-file-input 
      v-model="company.logo" 
      label="Logo" 
      accept="image/*"
      :rules="[ value => {
        if(props.isUpdate) return true
        return !!value.length || 'Logo is required.'
      } ]"
    />
    <v-text-field 
      v-model="company.name" 
      label="Name"
      :rules="[ value => !!value || 'Name is required.' ]"
    ></v-text-field>
    <v-combobox
      v-model="company.status"
      label="Status"
      :items="['Active', 'Inactive']"
      :rules="[ value => !!value || 'Status is required.' ]"
    ></v-combobox>

    <v-btn class="mt-2" color="primary" type="submit" :loading="loading">Submit</v-btn>
  </v-form>
</template>

<script setup>
import { reactive, ref, toRefs} from 'vue';
import { useCompanyStore } from '@/stores/company';

const props = defineProps({
  isUpdate: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number,
  }
})
const emits = defineEmits(['save'])
const companyStore = useCompanyStore();
const formRef = ref(null)
const company = reactive({
  id: null,
  logo: null,
  name: "",
  status: "Active",
})
const loading = ref(false)

const onSubmit = async () => {
  console.log(company);
  const { valid } = await formRef.value.validate()
  if(!valid) return;

  if(props.isUpdate) {
    const localCompany = reactive({ ...toRefs(company) });;
    console.log("🚀 ~ onSubmit ~ localCompany:", localCompany.logo)
    if(!localCompany.logo) {
      localCompany.logo = null
    }
    console.log("🚀 ~ onSubmit ~ localCompany:", localCompany)
    const formData = createFormData(localCompany)
    await companyStore.updateCompany(localCompany.id, formData)
  }
  else {
    const formData = createFormData(company)
    await companyStore.addCompany(formData);
  }

  emits('save')
}

const createFormData = (object) => {
  const formData = new FormData();

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      formData.append(key, object[key]);
    }
  }

  return formData;
}

onMounted(async () => {
  console.log(props.id);
  if(props.id) {
    const response = await companyStore.getCompany(props.id);
    response.oldLogo = response.logo
    response.logo = null
    Object.assign(company, response)
  }

})

const clear = () => {
  Object.assign(company, {
    id: null,
    logo: null,
    name: "",
    status: "Active",
  })
}

defineExpose({clear})
</script>

<style lang="scss" scoped>

</style>