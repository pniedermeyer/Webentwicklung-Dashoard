<template>
  <v-container>
    <v-app-bar class="appbarconf" color="blue darken-2" dense dark fixed app>
      <v-icon v-on:click="openModal">mdi-cog</v-icon>
      <popup ref="modalpop"></popup>
      <snack-notifier ref="snackbar"></snack-notifier>
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
import {
  generateUrlWithSettingsId,
  copyTextToClipboard,
  generateShortId,
  sendUserSettingsToServer
} from "../functions/sendUserData";
import { getCurrentUrlDataState } from "../functions/UrlSettings";
import SnackNotifier from "./SnackNotifier.vue";
import axios from "axios";
import {getBaseUrl} from "../functions/UrlUtils";
export default {
  name: "app-bar",
  components: { Popup, SnackNotifier },
  data: () => ({
    snackbarShown: false,
    snackbarText: "",
    snackbarMode: "info"
  }),
  methods: {
    openModal: function() {
      this.$refs.modalpop.showModal();
    },

    createBackendLinkAndCopyToClipboard: function() {
      let that = this;
      let settingsId = generateShortId();
      sendUserSettingsToServer(
              settingsId,
              getCurrentUrlDataState(),
              function() {
                copyTextToClipboard(
                        generateUrlWithSettingsId(window.location, settingsId)
                );
                that.$refs.snackbar.showSnackbar(
                        "Der Link wurde in die Zwischenablage kopiert",
                        "success"
                );
              },
              function() {
                that.$refs.snackbar.showSnackbar(
                        "Fehler bei der Erstellung des Teilen-Links",
                        "error"
                );
              }


    showSnackbar(content, isError) {
      this.snackbarText = content
      this.snackbarShown = true
      if (isError) {
        this.snackbarMode = "error"
      } else {
        this.snackbarMode = "success"
      }
    },

    copyShareLinkToClipboard: function(id) {
      let completeUrl = window.location.toString()
      let hashLocation = completeUrl.indexOf('#')
      if (hashLocation <= 0) {
        hashLocation = completeUrl.length;
      }
      let baseUrl = window.location.toString().slice(0, hashLocation);

      let targetUrl = baseUrl + "#" + id;

      navigator.clipboard.writeText(targetUrl)

      return true
    },

    generateAndCopyShareLink: function () {
      let id = Math.random().toString(36).slice(2)

      axios.put(getBaseUrl()+"/settings", getCurrentUrlDataState(), {
        headers: {
          'x-guid': id
        }
      );
    }
  }
};
</script>
