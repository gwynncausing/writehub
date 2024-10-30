<template>

  <v-card class="ma-6 pa-6">
    <h1 class="mb-5">Create Article </h1>
    <v-form @submit.prevent="onSubmit" ref="formRef">
      <v-combobox
        label="Company"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
      ></v-combobox>

      <v-file-input label="File input" accept="image/*"></v-file-input>

      <v-text-field label="Title"></v-text-field>

      <v-text-field label="Link"></v-text-field>

      <v-date-input v-model="date" label="Date"></v-date-input>

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
            v-model="value"
            rows="2"
            variant="outlined"
            auto-grow
            full-width
            hide-details
          ></v-textarea>
        </v-sheet>
      </v-card>

      <v-btn class="mt-2" color="primary" type="submit" :loading="loading">Submit</v-btn>

    </v-form>
  </v-card>
</template>
<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'

const formRef = ref(null)
const loading = ref(false);
const alignment = ref(1)
const formatting = ref([])
const value = ref('Toggle button requirements.\n\nHave at least three toggle buttons in a group\nLabel buttons with text, an icon, or');

const date = ref(new Date());

const onSubmit = async () => {
  const {valid} = await formRef.value.validate();
  console.log("🚀 ~ onSubmit ~ formRef.value:", formRef.value)
  if(!valid) return;
  console.log("cool");
}
</script>