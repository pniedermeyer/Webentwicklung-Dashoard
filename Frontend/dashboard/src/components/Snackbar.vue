<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {
      snackbar: false,
      text: ""
    };
  },
  methods: {
    showSnackbar(text) {
      this.text = text;
      this.snackbar = true;
    }
  }
};
</script>

