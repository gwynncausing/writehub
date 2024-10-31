<template>
  <v-card class="ma-6 pa-6">
    <h1 class="mb-5">Create Article </h1>
    <v-form @submit.prevent="onSubmit" ref="formRef">

      <v-img 
        :width="300"
        aspect-ratio="16/9"
        cover
        :src="`http://localhost:8080/${form.oldImage}`" lazy alt="Company Logo"/>

      <v-file-input 
        v-model="form.image"
        label="Image" 
        accept="image/*"
        :rules="[ value => {
          if(isUpdate) return true
          return !!value.length || 'Image is required.'
        } ]"
      />

      <v-combobox
        v-model="form.company"
        label="Company"
        :items="companies"
        item-value="id"
        item-title="name"
        :rules="[ value => !!value || 'Title is required.' ]"
        ></v-combobox>

      <v-text-field 
        v-model="form.title"
        label="Title"
        :rules="[ value => !!value || 'Title is required.' ]"
      ></v-text-field>

      <v-text-field 
        v-model="form.link"
        label="Link"
        :rules="[ value => !!value || 'Link is required.' ]"
      ></v-text-field>


      <v-date-input 
        v-model="form.date" 
        label="Date"
        :rules="[ value => !!value || 'Date is required.' ]"
      ></v-date-input>

      <v-card class="mx-auto">
        <div class="d-flex justify-space-between pa-4 pb-0">
          <v-btn-toggle
            v-model="formatting"
            variant="outlined"
            divided
            multiple
          >
            <v-btn>
              <v-icon icon="mdi-format-italic"></v-icon>
            </v-btn>

            <v-btn>
              <v-icon icon="mdi-format-bold"></v-icon>
            </v-btn>

            <v-btn>
              <v-icon icon="mdi-format-underline"></v-icon>
            </v-btn>

            <v-btn>
              <div class="d-flex align-center flex-column justify-center">
                <v-icon icon="mdi-format-color-text"></v-icon>

                <v-sheet
                  color="purple"
                  height="4"
                  width="26"
                  tile
                ></v-sheet>
              </div>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle
            v-model="alignment"
            variant="outlined"
            divided
          >
            <v-btn>
              <v-icon icon="mdi-format-align-center"></v-icon>
            </v-btn>

            <v-btn>
              <v-icon icon="mdi-format-align-left"></v-icon>
            </v-btn>

            <v-btn>
              <v-icon icon="mdi-format-align-right"></v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>

        <v-sheet class="pa-4 text-center">
          <v-textarea
            v-model="form.content"
            rows="2"
            variant="outlined"
            auto-grow
            full-width
            hide-details
            :rules="[ value => !!value || 'Link is required.' ]"
          ></v-textarea>
        </v-sheet>
      </v-card>

      <v-btn class="mt-2" color="primary" type="submit" :loading="loading">Submit</v-btn>

    </v-form>
  </v-card>
</template>
<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useCompanyStore } from '@/stores/company';
import { useArticleStore } from '@/stores/article';
import { useRouter, useRoute } from 'vue-router';

const formRef = ref(null)
const form = reactive({
  company: null,
  image: null,
  title: "",
  link: "",
  date: new Date(),
  content: "",
  status: 'For Edit'
})
const loading = ref(false);
const alignment = ref(1)
const formatting = ref([])
const isUpdate = ref(false)

const articleStore = useArticleStore();
const router = useRouter();
const onSubmit = async () => {
  const {valid} = await formRef.value.validate();
  if(!valid) return;
  loading.value = true

  if(isUpdate.value) {
    const localForm = reactive({ ...toRefs(form) });;
    if(!localForm.image) {
      localForm.image = null
    }
    const formData = createFormData(localForm)
    await articleStore.updateArticle(route.params.id, formData)
  }
  else {
    const formData = createFormData({...form, company: form.company.id})
    await articleStore.addArticle(formData);
  }

  router.push('/dashboard')
}

const companyStore = useCompanyStore();
const companies = ref([])
const getAllCompany = async () => {
  const response = await companyStore.getAllCompany();
  companies.value = response
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

const route = useRoute();
onMounted(async () => {
  getAllCompany();
  const id = route.params.id
  if(id) {
    isUpdate.value = true
    const response = await articleStore.getArticle(id);
    const company = companies.value.find(item => item.id === response.company)
    Object.assign(form, {
      company: company,
      oldImage: response.image,
      image: null,
      title: response.title,
      link: response.title,
      date: new Date(),
      content: response.content,
      status: 'For Edit'
  })
  }
})
</script>