<template>
  <v-card class="ma-3">
    <v-tabs v-model="tab" background-color="deep-purple accent-4" centered dark icons-and-text>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Fälle
        <v-icon>mdi-numeric</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Verlauf
        <v-icon>mdi-chart-timeline-variant</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Tote
        <v-icon>mdi-skull-outline</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
        <v-card flat>
          <v-card-text>Text</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <!-- <b-tabs card>
        <b-tab title="Fälle">
          <b-container class="bv-example-row">
            <b-row>
              <b-col>
                Fälle
                {{this.data.cases}}
              </b-col>
              <b-col>
                Fälle per 100k
                {{this.data.cases100k}}
              </b-col>
              <b-col>
                Fälle per 100k letze 7 Tage
                {{this.data.cases100k7}}
              </b-col>
            </b-row>
            <b-row>{{this.data.name}}</b-row>
          </b-container>
        </b-tab>
        <b-tab title="Vergleich">
          <b-container class="bv-example-row">
            <b-row>
              Neuinfektionen
              {{this.data.newInfections}}
            </b-row>
            <b-row>{{this.data.name}}</b-row>
          </b-container>
        </b-tab>
        <b-tab title="Tote">
          <b-container class="bv-example-row">
            <b-row>{{"Tote: " + this.data.deaths}}</b-row>
            <b-row>{{this.data.name}}</b-row>
          </b-container>
        </b-tab>
    </b-tabs>-->
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  name: "Details",
  data() {
    return {
      tab: null,
      data: {
        name: "",
        cases: "",
        cases100k: "",
        cases100k7: "",
        newInfections: "",
        deaths: ""
      }
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
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      infectionData: "infectionData"
    })
  }
};

function fillData(parent) {
  if (parent.infectionData) {
    switch (parent.view) {
      case 0:
        console.log("0");
        console.log(parent.infectionData);

        parent.data = {
          name: parent.infectionData.name,
          cases: parent.infectionData.cases_DE,
          cases100k:
            Math.round(parent.infectionData.cases_per_100k_DE * 100) / 100,
          cases100k7:
            Math.round(parent.infectionData.cases7_per_100k_DE * 100) / 100,
          newInfections: parent.infectionData.new_cases_DE,
          deaths: parent.infectionData.deaths_DE
        };
        break;
      case 1:
        if (parent.BL_ID) {
          let BLdata = parent.infectionData.states.find(
            e => e.BL_ID === parent.BL_ID
          );

          parent.data = {
            name: BLdata.name,
            cases: BLdata.cases_BL,
            cases100k: Math.round(BLdata.cases_per_100k_BL * 100) / 100,
            cases100k7: Math.round(BLdata.cases7_per_100k_BL * 100) / 100,
            newInfections: BLdata.new_cases_BL,
            deaths: BLdata.deaths_BL
          };
        } else {
          empty(parent);
        }
        break;
      case 2:
        if (parent.BL_ID && parent.LK_ID) {
          let LKdata = parent.infectionData.states
            .find(e => e.BL_ID === parent.BL_ID)
            .counties.find(ee => ee.LK_ID === parent.LK_ID);

          parent.data = {
            name: LKdata.LK,
            cases: LKdata.cases_LK,
            cases100k: Math.round(LKdata.cases_per_100k_LK * 100) / 100,
            cases100k7: Math.round(LKdata.cases7_per_100k_LK * 100) / 100,
            newInfections: LKdata.new_cases_LK,
            deaths: LKdata.deaths_LK
          };
          console.log(parent.infectionData);
        } else {
          empty(parent);
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
    name: "",
    cases: "",
    cases100k: "",
    cases100k7: "",
    newInfections: "",
    deaths: ""
  };
}
</script>
<style scoped>
a:hover {
  text-decoration: none !important;
}
</style>