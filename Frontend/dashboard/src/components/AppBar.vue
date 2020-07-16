<template>
  <v-app-bar class="appbarconf" color="blue darken-2" dense dark fixed app>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="openModal">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <span>Link teilen</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="getLocation">
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>
      </template>
      <span>Mein Standort lokalisieren</span>
    </v-tooltip>
    <popup ref="modalpop"></popup>
    <snack-notifier ref="snackbar"></snack-notifier>
    <v-toolbar-title>Corona Dashboard</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="createBackendLinkAndCopyToClipboard">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </template>
      <span>Link teilen</span>
    </v-tooltip>
    <!-- <v-icon v-on:click="createBackendLinkAndCopyToClipboard">mdi-share-variant</v-icon> -->
  </v-app-bar>
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
    getLocation() {
      this.$emit("setGeoLocation");
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     position => {
      //       this.$refs.Map.setBrowserLocation([
      //         position.coords.latitude,
      //         position.coords.longitude
      //       ]);
      //     },
      //     error => {
      //       console.log(error.message);
      //     }
      //   );
      // }
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
      );
    },

    showSnackbar(content, isError) {
      this.snackbarText = content;
      this.snackbarShown = true;
      if (isError) {
        this.snackbarMode = "error";
      } else {
        this.snackbarMode = "success";
      }
    }
  }
};
</script>
