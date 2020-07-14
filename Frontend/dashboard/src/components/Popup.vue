<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" style="z-index: 1010;">
      <v-card shaped>
        <v-card-title class="justify-center">
          <span class="headline">Einstellungen</span>
          <v-icon color="black">mdi-cog-outline</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <span class="subheading font-weight-light mr-1">Anzahl Graphen:</span>
                <span class="display-3 font-weight-light" v-text="barsShownTemp"></span>
                <v-slider
                  v-model="barsShownTemp"
                  controls
                  thumb-label
                  step="1"
                  ticks="always"
                  min="1"
                  max="14"
                >
                  <template v-slot:prepend>
                    <v-icon color="red" @click="decrementgraphs">mdi-minus</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-icon color="green" @click="incrementgraphs">mdi-plus</v-icon>
                  </template>
                </v-slider>
              </v-col>
              <v-col cols="12">
                <span class="subheading font-weight-light mr-1">Anzahl Tage:</span>
                <span class="display-3 font-weight-light" v-text="days"></span>
                <v-slider v-model="days" thumb-label step="1" ticks="always" min="1" max="10">
                  <template v-slot:prepend>
                    <v-icon color="red" @click="decrementdays">mdi-minus</v-icon>
                  </template>

                  <template v-slot:append>
                    <v-icon color="green" @click="incrementdays">mdi-plus</v-icon>
                  </template>
                </v-slider>
              </v-col>
              <v-col cols="12" class="shrink" style="min-width: 220px;">
                <span class="headline" style="font-size: 0.875rem !important;">Farbe des Graphen:</span>
                <v-text-field v-model="baseColorTemp" hide-details class="ma-0 pa-0" solo>
                  <template v-slot:append>
                    <v-menu
                      v-model="menu"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="baseColorTemp"
                            flat
                            :swatches="swatches"
                            show-swatches
                          />
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
              <v-col>
                <v-row no-gutters>
                  <v-col cols="12" sm="6" md="6">
                    <v-switch v-model="barchartvisibleTemp" class="ma-2" label="Barchart"></v-switch>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="casesGermanyVisibleTemp"
                      class="ma-2"
                      label="Fallzahlen Deutschland"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="6" md="6">
                    <v-switch
                      v-model="casesStateVisibleTemp"
                      class="ma-2"
                      label="Fallzahlen Bundesland"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="casesCountyVisibleTemp"
                      class="ma-2"
                      label="Fallzahlen Landkreis"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12" sm="6" md="6">
                    <v-switch v-model="mapVisibleTemp" class="ma-2" label="Karte"></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-switch v-model="lineChartVisibleTemp" class="ma-2" label="Linechart"></v-switch>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveData()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>
// to-do
// On-click events speichern nicht sofort -> zwischenspeicherung bis [safe]

import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {
      swatches: [
        ["#FF0000", "#AA0000", "#550000"],
        ["#FFFF00", "#AAAA00", "#555500"],
        ["#00FF00", "#00AA00", "#005500"],
        ["#00FFFF", "#00AAAA", "#005555"],
        ["#0000FF", "#0000AA", "#000055"]
      ],
      casesCountyVisibleTemp: true,
      casesGermanyVisibleTemp: true,
      casesStateVisibleTemp: true,
      barchartvisibleTemp: true,
      lineChartVisibleTemp: true,
      mapVisibleTemp: true,

      days: 5,
      dialog: false,
      mask: "!#XXXXXXXX",
      menu: false,
      barsShownTemp: 5,
      baseColorTemp: "#1976D2FF"
    };
  },
  methods: {
    showModal() {
      this.dialog = true;
    },
    decrementdays() {
      this.days--;
    },
    incrementdays() {
      this.days++;
    },
    decrementgraphs() {
      this.barsShownTemp--;
    },
    incrementgraphs() {
      this.barsShownTemp++;
    },
    saveData() {
      this.barsShown = this.barsShownTemp;
      this.baseColor = this.baseColorTemp;
      this.dialog = false;
      this.visibleComponents.barchartvisible = this.barchartvisibleTemp;
      this.visibleComponents.casesGermanyVisible = this.casesGermanyVisibleTemp;
      this.visibleComponents.casesStateVisible = this.casesStateVisibleTemp;
      this.visibleComponents.casesCountyVisible = this.casesCountyVisibleTemp;
      this.visibleComponents.mapVisible = this.mapVisibleTemp;
      this.visibleComponents.lineChartVisible = this.lineChartVisibleTemp;
    }
  },
  computed: {
    ...mapFields([
      "barsShown",
      "baseColor",
      "casesGermanyVisible",
      "casesStateVisible",
      "casesCountyVisible",
      "mapVisible",
      "barchartvisible",
      "visibleComponents",
      "lineChartVisible"
    ]),
    swatchStyle() {
      const { baseColorTemp, menu } = this;
      return {
        backgroundColor: baseColorTemp,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out"
      };
    }
  }
};
</script>

