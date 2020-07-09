<template>
  <v-dialog
      v-model="lineChartDialogConfig"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Hier kommen die erweiterten Infos und großer Graph hin
        </v-card-title>

        <v-card-text>
          BLA BLA BLA
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="lineChartDialogConfig=null"
          >
            Mach zu den Scheiß
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapFields } from "vuex-map-fields";


export default {
  name: "LineChartPopUp",
  computed: {
    ...mapFields({
      lineChartDialogConfig: 'lineChartDialogConfig'  
    })
  },

}
</script>

<style>
.v-dialog {
    z-index:-1;
    position: relative;
}
</style>