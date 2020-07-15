<template>
  <v-container>
    <v-app-bar class="appbarconf" color="blue darken-2" dense dark fixed app>
      <v-icon v-on:click="openModal">mdi-cog</v-icon>
      <popup ref="modalpop"></popup>
      <v-toolbar-title>Corona Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon v-on:click="generateAndCopyShareLink">mdi-share-variant</v-icon>
    </v-app-bar>

    <v-snackbar
            v-model="snackbarShown"
            :timeout="3000"
            :top="true"
            :color="snackbarMode"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
                dark
                text
                v-bind="attrs"
                @click="snackbarShown = false"
        >
          Schließen
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<style>
.appbarconf {
  max-height: 50px;
}
</style>
<script>
import Popup from "./Popup.vue";
import axios from "axios";
import {getCurrentUrlDataState} from "../functions/UrlSettings";
import {getBaseUrl} from "../functions/UrlUtils";
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
      }).then(result => result.status === 200 && this.copyShareLinkToClipboard(id) ?
        this.showSnackbar("Link in Zwischenablage kopiert", false) :
        this.showSnackbar("Fehler bei Linkerstellung", true)
      ).catch(
        this.showSnackbar("Fehler bei Linkerstellung", true)
      )
    }
  }
};
</script>
