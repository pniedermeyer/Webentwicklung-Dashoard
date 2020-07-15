<template>
  <v-app-bar class="appbarconf" color="blue darken-2" dense dark fixed app>
    <v-icon v-on:click="openModal">mdi-cog</v-icon>
    <popup ref="modalpop"></popup>
    <v-toolbar-title>Corona Dashboard</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<style>
.appbarconf {
  max-height: 50px;
}
</style>
<script>
import Popup from "./Popup.vue";
export default {
  name: "app-bar",
  components: { Popup },
  data: () => ({}),
  methods: {
    openModal: function() {
      this.$refs.modalpop.showModal();
    }
  }
};
</script>
