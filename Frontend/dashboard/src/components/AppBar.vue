<template>
    <v-container>
        <v-app-bar class="appbarconf" color="blue darken-2" dense dark fixed app>
          <v-icon v-on:click="openModal">mdi-cog</v-icon>
          <popup ref="modalpop"></popup>
          <v-toolbar-title>Corona Dashboard</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon v-on:click="createBackendLinkAndCopyToClipboard">mdi-share-variant</v-icon>
        </v-app-bar>
    </v-container>
</template>
<style>
.appbarconf {
  max-height: 50px;
}
</style>
<script>
import Popup from "./Popup.vue";
import {generateUrlWithSettingsId, copyTextToClipboard, generateShortId, sendUserSettingsToServer} from "../functions/sendUserData";
import {getCurrentUrlDataState} from "../functions/UrlSettings";
import app from "../App.vue";

export default {
  name: "app-bar",
  components: { Popup },
  data: () => ({
    snackbarShown: false,
    snackbarText: "",
    snackbarMode: "info"
  }),
  methods: {
    openModal: function() {
      this.$refs.modalpop.showModal();
    },

    createBackendLinkAndCopyToClipboard: function () {
      let settingsId = generateShortId();
      sendUserSettingsToServer(settingsId, getCurrentUrlDataState(), function () {
          alert("success")
        copyTextToClipboard(generateUrlWithSettingsId(window.location, settingsId))
          app.components.SnackNotifier.methods.showSnackbar("Der Link wurde in die Zwischenablage kopiert", "success")
      }, function () {
          alert("error")
          app.components.SnackNotifier.methods.showSnackbar("Fehler bei der Erstellung des Teilen-Links", "error")
      })
    }
  }
};
</script>
