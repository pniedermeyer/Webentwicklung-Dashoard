<template>
  <div id="global-options-container">
    <v-card id="options" class="w-75">
      <v-icon
        id="changeOptionsSize"
        v-if="showOptions"
        v-on:click="minimizeOrMaximizeOptions"
      >mdi-chevron-down</v-icon>
      <v-icon
        id="changeOptionsSize"
        v-if="!showOptions"
        v-on:click="minimizeOrMaximizeOptions"
      >mdi-chevron-up</v-icon>
      <v-expand-transition>
        <div v-show="showOptions">
          <v-list-item two-line>
            <v-list-item-content>
              <div class="d-flex flex-column flex-md-row">
                <v-autocomplete
                  v-model="BL_ID"
                  :items="states"
                  :search-input.sync="searchBL"
                  @input="setSelState"
                  item-text="name"
                  item-value="BL_ID"
                  label="Bundesland"
                  class="px-3"
                  style="width:100%; margin:0px !important; padding"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="LK_ID"
                  :items="counties"
                  @input="setSelCounty"
                  hide-no-data
                  hide-selected
                  item-text="full_name"
                  item-value="LK_ID"
                  label="Landkreis"
                  class="px-3"
                  style="width:100%; margin:0px !important"
                  return-object
                ></v-autocomplete>
                <v-btn outlined @click="findOnMap()" color="primary" class="align-self-center mx-4">
                  <span class>Find on Map</span>
                  <v-icon right>mdi-magnify</v-icon>
                </v-btn>
              </div>
              <v-container fluid class="pb-0">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-subheader class="sliderLabelCases">Fallzahlen</v-subheader>
                    <v-slider
                      :max="2"
                      :tick-labels="allCasesOptions.map(item => item.label)"
                      class="pl-0"
                      ticks
                      @input="setCaseOption"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-subheader class="sliderLabelResolution">Auflösung der Map</v-subheader>
                    <v-slider
                      v-model="resolutionSliderPos"
                      :min="-3"
                      :max="0"
                      @input="setMapResolution"
                      :tick-labels="this.mapResolutions"
                      class="pl-0"
                      ticks
                    ></v-slider>
                  </v-col>
                </v-row>
              </v-container>
              <!-- <div id="sliderContainer" class="d-flex">
                <v-col>
                  <v-subheader class="pl-0">Fallzahlen</v-subheader>
                  <v-slider
                    :max="2"
                    :tick-labels="allCasesOptions.map(item => item.label)"
                    class="pl-0"
                    ticks
                    @input="setCaseOption"
                  ></v-slider>
                </v-col>
                <v-col>
                  <v-subheader class="pl-0">Auflösung der Map</v-subheader>
                  <v-slider
                    v-model="resolutionSliderPos"
                    :min="-3"
                    :max="0"
                    @input="setMapResolution"
                    :tick-labels="this.mapResolutions"
                    class="pl-0"
                    ticks
                  ></v-slider>
                </v-col>
              </div>-->
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

//vuetify changes the css styl when an icon has the @click attribute therfore the event is added manually
export default {
  data: () => ({
    showOptions: true,
    resolutionSliderPos: -3,
    states: [{ BL_ID: 0, name: "Alle" }],
    mapResolutions: ["Low", "Medium", "High", "Original"],
    casesOptions: ["Alle", "100K", "100K / 7 Tage"],
    selectedState: null,
    counties: [""],
    selectedCounty: null,
    zoomstufe: "",
    searchBL: "",
    zoomsliderOptions: {
      min: 0,
      interval: 1,
      max: 3,
      marks: true
    }
  }),
  methods: {
    setSelState(stateId) {
      // console.log('GO setSelState: ', stateId);
      this.LK_ID = null;
      // this.BL_ID = value;
      this.selectCountiesToState(stateId);
    },
    minimizeOrMaximizeOptions() {
      this.showOptions = !this.showOptions;
    },
    setSelCounty(value) {
      this.LK_ID = value.LK_ID;
      this.BL_ID = value.BL_ID;
      // if (!this.BL_ID) {
      //   this.BL_ID = this.counties.find(e => e.LK_ID === value).BL_ID;
      this.selectCountiesToState(this.BL_ID);
      // }
    },
    setMapResolution(value) {
      if (value > 0) {
        value = 0;
      }
      this.mapResolution = Math.abs(value);
    },
    setCaseOption(caseOption) {
      this.casesOption = this.allCasesOptions[caseOption].code;
    },
    selectCountiesToState(stateId) {
      if (stateId != 0) {
        let state = this.states.find(state => state.BL_ID === stateId);
        let tempCounties = state.counties;
        tempCounties.sort(function(a, b) {
          return a.LK < b.LK ? -1 : 1;
        });
        this.counties = tempCounties;
      } else {
        let tempCounties = [];
        for (let i = 1; i < this.states.length; i++)
          this.states[i].counties.forEach(county => {
            county.BL_ID = this.states[i].BL_ID;
            tempCounties.push(county);
          });
        tempCounties.sort(function(a, b) {
          return a.LK < b.LK ? -1 : 1;
        });
        this.counties = tempCounties;
      }
      this.selectedCounty = null;
    },
    saveUserSettings() {
      //Hier Settings speichern!
      console.log("Jetzt könnten wir speichern!");
    },
    findOnMap() {
      this.$emit("focus-map");
    }
  },
  watch: {
    infectionData: function() {
      initStates(this);
      this.selectCountiesToState(this.BL_ID);
    },
    BL_ID: function() {
      initStates(this);
      this.selectCountiesToState(this.BL_ID);
    }
  },
  mounted() {
    initStates(this);
    this.selectCountiesToState(this.BL_ID);
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      casesOption: "casesOption",
      allCasesOptions: "allCasesOptions",
      infectionData: "infectionData",
      mapResolution: "mapResolution"
    })
  }
};

function initStates(parent) {
  try {
    let tempStates = [...parent.infectionData.states];
    tempStates.sort(function(a, b) {
      return a.name < b.name ? -1 : 1;
    });
    tempStates.unshift({ BL_ID: 0, name: "Alle" });
    parent.states = tempStates;
  } catch (e) {
    if (e instanceof TypeError) {
      //Is trown when the async loaded data is not yet finished loading. No real Error
      // console.log(e)
    } else {
      console.error(e);
    }
  }
}
</script>

<style scoped>
.sliderLabelCases {
  position: absolute;
  bottom: 60%;
  left: 0;
}

.sliderLabelResolution {
  position: absolute;
  bottom: 60%;
  left: 0;
}

#zoomer {
  padding-bottom: 50px;
}

.theme--light.v-icon:focus::after {
  opacity: 0 !important;
}

button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  color: #333;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-family: "微软雅黑", arail;
  cursor: pointer;
}
v-select {
  cursor: pointer;
}

#options {
  position: absolute;
  bottom: 2%;
  z-index: 1001;
  width: 75%;
  min-height: 1.5rem;
}

@media screen and (max-width: 959px) {
  #options {
    left: 0%;
    width: 100% !important;
  }
}

@media screen and (min-width: 960px) {
  #options {
    left: 12.5%;
    width: 75% !important;
  }
}

@media screen and (max-width: 649px) {
  #sliderContainer {
    flex-direction: column;
  }
}

@media screen and (min-width: 650px) {
  #sliderContainer {
    flex-direction: row;
  }
}

#d-large {
  position: absolute;
  bottom: 2%;
  left: 12.5%;
  z-index: 1001;
  width: 75%;
}

#d-small {
  position: absolute;
  bottom: 2%;
  z-index: 1001;
  width: 100%;
}

#changeOptionsSize {
  right: 0.5%;
  position: absolute;
  z-index: 1010;
  padding: 0 !important;
  border: 0;
}
</style>

<!-- 
GET /settings
Mit GET /settings kann man auf gespeicherte settings zugreifen. Im Request Body werden die
Settings, die benötigt werden übergeben. In der Response, werden dann nur die Settings, deren
Wert in der Request true war zurückgegeben.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren 
Endpunkte machen)

Request-Body:
{
    zoom: boolean,
    graphs: boolean,
    selectedCounty: boolean,
    selectedDistrict: boolean,
    selectedMetric: boolean,
    selectedTable: boolean
}

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}



PUT /settings
Mit PUT /settings kann man settings speichern. Es müssen nicht alle setting werde übergeben werden,
das Backend wird nur die speichern, die tatsächlich teil des Requests war. Die anderen settings
bleiben unverändert.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren Endpunkte machen)

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases' | 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}
-->
