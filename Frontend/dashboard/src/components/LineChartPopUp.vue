<template>
  <v-dialog
      v-model="lineChartDialogConfig.shown"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          {{lineChartDialogConfig.label}}
        </v-card-title>

        <v-card-text>
          <LineChart :data="lineChartDialogConfig.data" :label="lineChartDialogConfig.label" :labelShown="true"></LineChart>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closePopup"
          >
            Mach zu den Scheiß
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import LineChart from "./LineChart.vue"


export default {
  name: "LineChartPopUp",
  computed: {
    ...mapFields({
      lineChartDialogConfig: 'lineChartDialogConfig'  
    })
  },
  components: {
    LineChart
  },
  methods: {
    closePopup(){
      this.lineChartDialogConfig = {data: [], label:'', shown: false}
    }
  }
}
</script>

<style>
.v-dialog {
    z-index:-1;
    position: relative;
}
</style>