<template>
  <v-card class="ma-3">
    <v-app-bar color="blue darken-2" dark dense>
      <v-spacer></v-spacer>
      <v-toolbar-title id="gerTitle">{{this.data.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-tabs v-model="tab" background-color="light" icons-and-text :grow="true" show-arrows>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Fälle
        <v-icon>mdi-numeric</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Neu-Infektionen
        <v-icon>mdi-chart-timeline-variant</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Tote
        <v-icon>mdi-skull-outline</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :value="'tab-1'">
        <v-card flat>
          <v-container>
            <v-row>
              <v-col sm="12" md="4">
                <v-row>
                  <v-card-text>Alle</v-card-text>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-card-title class="blue--text text--darken-2 single-number">{{this.data.cases}}</v-card-title>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
              <v-col sm="12" md="4">
                <v-row>
                  <v-card-text>Pro 100K Einwohner</v-card-text>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-card-title
                    class="blue--text text--darken-2 single-number"
                  >{{this.data.cases100k}}</v-card-title>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
              <v-col sm="12" md="4">
                <v-row>
                  <v-card-text>Pro 100K Einwohner / 7 Tage</v-card-text>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-card-title
                    class="blue--text text--darken-2 single-number"
                  >{{this.data.cases100k7}}</v-card-title>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="visibleComponents.lineChartVisible">
              <v-col xs="6">
                <LineChart
                  style="height:15rem"
                  :data="data.lineChartData.cases"
                  :dates="data.lineChartData.date"
                  :label="'Fälle gesamt'"
                  v-on:lineclick="openLargerGraph"
                ></LineChart>
              </v-col>
              <v-col xs="6">
                <LineChart
                  style="height:15rem"
                  :data="data.lineChartData.cases7per100k"
                  :dates="data.lineChartData.date"
                  :label="'Fälle pro 100k, letzte 7 Tage'"
                  v-on:lineclick="openLargerGraph"
                ></LineChart>
              </v-col>
            </v-row>
          </v-container>

          <!-- </v-card-text> -->
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'tab-2'">
        <v-card flat>
          <v-card-title v-if="!visibleComponents.lineChartVisible">
            <v-spacer></v-spacer>
            <v-card-text class="blue--text text--darken-2 single-number">{{this.data.newInfections}}</v-card-text>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-row v-if="visibleComponents.lineChartVisible" align="center" justify="center">
            <v-col md="4">
              <v-flex class="blue--text text--darken-2 single-number">{{this.data.newInfections}}</v-flex>
            </v-col>
            <v-col md="8">
              <LineChart
                style="height:15rem"
                v-if="visibleComponents.lineChartVisible"
                :data="data.lineChartData.change"
                :dates="data.lineChartData.date"
                :label="'Neuinfektionen'"
                v-on:lineclick="openLargerGraph"
              ></LineChart>
            </v-col>
          </v-row>
          <!-- </v-card-text> -->
        </v-card>
      </v-tab-item>
      <v-tab-item :value="'tab-3'">
        <v-card flat>
          <v-card-title v-if="!visibleComponents.lineChartVisible">
            <v-spacer></v-spacer>
            <v-card-text class="red--text text--darken-2 single-number">{{this.data.deaths}}</v-card-text>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-row v-if="visibleComponents.lineChartVisible" align="center" justify="center">
            <v-col md="4">
              <v-flex class="red--text text--darken-2 single-number">{{this.data.deaths}}</v-flex>
            </v-col>
            <v-col md="8">
              <LineChart
                style="height:15rem"
                v-if="visibleComponents.lineChartVisible"
                :data="data.lineChartData.deaths"
                :dates="data.lineChartData.date"
                :label="'Tote'"
                v-on:lineclick="openLargerGraph"
              ></LineChart>
            </v-col>
          </v-row>

          <!-- </v-card-title> -->
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import LineChart from "./LineChart.vue";
import {
  getHistoryDeutschland,
  getHistoryBL,
  getHistoryLK
} from "../functions/getHistory.js";

export default {
  name: "Details",
  components: {
    LineChart
  },
  data() {
    return {
      tab: null,
      data: {
        name: "",
        cases: "",
        cases100k: "",
        cases100k7: "",
        newInfections: "",
        deaths: "",
        lineChartData: {}
      },
      dialog: this.lineChartDialogConfig //Change on click event
    };
  },
  props: {
    view: Number
  },
  mounted() {
    fillData(this);
  },
  watch: {
    BL_ID: function() {
      fillData(this);
    },
    LK_ID: function() {
      fillData(this);
    },
    infectionData: function() {
      fillData(this);
    }
    // lineChartDialogConfig: function() {
    //   console.log("oainf")
    //   this.dialog = true
    // },
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      infectionData: "infectionData",
      pastInfectionData: "pastInfectionData",
      lineChartDialogConfig: "lineChartDialogConfig",
      visibleComponents: "visibleComponents"
    })
  },
  methods: {
    openLargerGraph: function(value) {
      //console.log(value);
      //TODO: Pop Up hat beim ersten Klick keine Daten!!
      this.lineChartDialogConfig = {
        label: value.label + " - " + this.data.name,
        data: value.data,
        shown: true,
        dates: value.dates
      };
      this.dialog = true;
      // return ""
    }
  }
};

function fillData(parent) {
  if (parent.infectionData) {
    switch (parent.view) {
      case 0:
        //Deutschand view

        parent.data = {
          name: parent.infectionData.name,
          cases: parent.infectionData.cases_DE,
          cases100k:
            Math.round(
              (parent.infectionData.cases_per_100k_DE + Number.EPSILON) * 100
            ) / 100,
          cases100k7:
            Math.round(
              (parent.infectionData.cases7_per_100k_DE + Number.EPSILON) * 100
            ) / 100,
          newInfections: parent.infectionData.change_DE,
          deaths: parent.infectionData.deaths_DE,
          lineChartData: getHistoryDeutschland()
        };

        break;
      case 1:
        //BL view
        if (parent.BL_ID) {
          let BLdata = parent.infectionData.states.find(
            e => e.BL_ID === parent.BL_ID
          );

          parent.data = {
            name: BLdata.name,
            cases: BLdata.cases_BL,
            cases100k:
              Math.round((BLdata.cases_per_100k_BL + Number.EPSILON) * 100) /
              100,
            cases100k7:
              Math.round((BLdata.cases7_per_100k_BL + Number.EPSILON) * 100) /
              100,
            newInfections: BLdata.change_BL,
            deaths: BLdata.deaths_BL,
            lineChartData: getHistoryBL(parent.BL_ID)
          };
        } else {
          empty(parent);
          parent.data.name = "Bundesland wählen";
        }
        break;
      case 2:
        //LK view
        if (parent.BL_ID && parent.LK_ID) {
          let LKdata = parent.infectionData.states
            .find(e => e.BL_ID === parent.BL_ID)
            .counties.find(ee => ee.LK_ID === parent.LK_ID);

          parent.data = {
            name: LKdata.full_name,
            cases: LKdata.cases_LK,
            cases100k:
              Math.round((LKdata.cases_per_100k_LK + Number.EPSILON) * 100) /
              100,
            cases100k7:
              Math.round((LKdata.cases7_per_100k_LK + Number.EPSILON) * 100) /
              100,
            newInfections: LKdata.change_LK,
            deaths: LKdata.deaths_LK,
            lineChartData: getHistoryLK(parent.BL_ID, parent.LK_ID)
          };
        } else {
          empty(parent);
          parent.data.name = "Landkreis wählen";
        }
        break;
      default:
        empty(parent);
    }
  } else {
    empty(parent);
  }
}

function empty(parent) {
  parent.data = {
    title: "",
    name: "",
    cases: "",
    cases100k: "",
    cases100k7: "",
    newInfections: "",
    deaths: "",
    lineChartData: {}
  };
}
</script>
<style scoped>
.single-number {
  font-size: 3rem;
}

a:hover {
  text-decoration: none !important;
}
</style>